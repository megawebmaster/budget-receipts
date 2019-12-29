import { combineEpics, Epic, ofType } from 'redux-observable'
import { catchError, delay, filter, ignoreElements, map, mergeAll, mergeMap, switchMap, tap } from 'rxjs/operators'
import { from, Observable, of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import WebWorker from '../../web-worker'
import {
  addReceiptItem,
  checkProcessingStatus,
  imageParsed,
  loadReceipts,
  processParsedImage,
  processReceiptImage,
} from './expenses.actions'
import { AvailableRoutes, ExpenseRouteAction } from '../../routes'
import { ExpensesService } from './expenses.service'
import { isActionOf } from 'typesafe-actions'
import { ProcessingMessage } from './receipt.types'
import { ParsingWorker } from './expense-parsing-worker'
import { categories } from '../categories'

const parsingWorker = WebWorker.build(ParsingWorker)

// TODO: Why is this loading?
const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    map(({ payload: { budget, year, month } }) => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/${month}/receipts`)
    )),
    mergeMap((request) => of(
      Promise.resolve(loadReceipts()),
      ExpensesService.fetchFromNetwork(request),
      ExpensesService.loadFromCache(request),
    )),
    mergeAll(),
  )

const processImageEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(processReceiptImage)),
    mergeMap(({ payload }) => ExpensesService.parseReceiptImage(payload)),
    map(token => checkProcessingStatus(token)),
  )

const checkImageProcessingStatusEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(checkProcessingStatus)),
    switchMap(({ payload: token }) => from(ExpensesService.getReceiptParsingResult(token)).pipe(
      map(result => processParsedImage({
        id: Date.now(),
        categories: categories(state$.value),
        parsingResult: result,
      })),
      catchError(() => of(checkProcessingStatus(token)).pipe(delay(10000))),
    )),
  )

const processParsedImageEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(processParsedImage)),
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
        observer.next(addReceiptItem({
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
        observer.next(imageParsed(response.id))
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
