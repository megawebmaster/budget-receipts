import { combineEpics, Epic, ofType } from 'redux-observable'
import { catchError, delay, filter, ignoreElements, map, mergeAll, mergeMap, switchMap, tap } from 'rxjs/operators'
import { from, Observable, of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import WebWorker from '../../web-worker'
import * as Actions from './expenses.actions'
import { AvailableRoutes, ExpenseRouteAction } from '../../routes'
import { ExpensesService } from './expenses.service'
import { isActionOf } from 'typesafe-actions'
import { ProcessingMessage } from './receipt.types'
import { ParsingWorker } from './expense-parsing-worker'
import { accessibleCategories } from '../categories'
import { ConnectionService } from '../../connection.service'

const parsingWorker = WebWorker.build(ParsingWorker)

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    map(({ payload: { budget, year, month } }) => (
      // TODO: Change this URL to match existing ones
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/${month}/receipts`)
    )),
    mergeMap((request) => of(
      Promise.resolve(Actions.loadReceipts()),
      ConnectionService.fetchFromNetwork(request, Actions.updateReceipts),
      ConnectionService.loadFromCache(request, Actions.updateReceipts),
    )),
    mergeAll(),
  )

const processImageEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.processReceiptImage)),
    mergeMap(({ payload }) => ExpensesService.parseReceiptImage(payload)),
    map(token => Actions.checkProcessingStatus(token)),
  )

const checkImageProcessingStatusEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.checkProcessingStatus)),
    switchMap(({ payload: token }) => from(ExpensesService.getReceiptParsingResult(token)).pipe(
      map(result => Actions.processParsedImage({
        id: Date.now(),
        categories: accessibleCategories(state$.value),
        parsingResult: result,
      })),
      catchError(() => of(Actions.checkProcessingStatus(token)).pipe(delay(10000))),
    )),
  )

const processParsedImageEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.processParsedImage)),
    tap(({ payload: { id, categories, parsingResult } }) => parsingWorker.postMessage({
      id,
      categories,
      items: parsingResult.lineItems,
    })),
    ignoreElements(),
  )

const receiveExpenseMatchesEpic: Epic<AppAction, AppAction, AppState> = () => new Observable((observer) => {
  parsingWorker.onmessage = (message: MessageEvent) => {
    const response = message.data as ProcessingMessage

    switch (response.type) {
      case 'item': {
        observer.next(Actions.addReceiptItem({
          id: response.id,
          value: {
            id: Date.now(),
            price: response.value.price,
            description: response.value.description,
            category: response.value.category,
          },
        }))
        break
      }
      case 'done':
        observer.next(Actions.imageParsed(response.id))
    }
  }
})

export const expensesEpic = combineEpics(
  pageLoadEpic,
  processImageEpic,
  checkImageProcessingStatusEpic,
  processParsedImageEpic,
  receiveExpenseMatchesEpic,
)
