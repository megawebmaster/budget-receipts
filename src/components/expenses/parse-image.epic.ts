import { combineEpics, Epic } from 'redux-observable'
import { catchError, delay, filter, ignoreElements, map, mergeMap, tap } from 'rxjs/operators'
import { from, Observable, of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import WebWorker from '../../web-worker'
import * as Actions from './expenses.actions'
import { ExpensesService } from './expenses.service'
import { isActionOf } from 'typesafe-actions'
import { ProcessingMessage } from './receipt.types'
import { ParsingWorker } from './expense-parsing-worker'
import { accessibleCategories } from '../categories'

const parsingWorker = WebWorker.build(ParsingWorker)

const processImageEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.processReceiptImage)),
    mergeMap(({ payload }) => ExpensesService.parseReceiptImage(payload)),
    map(token => Actions.checkProcessingStatus(token)),
  )

const checkImageProcessingStatusEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.checkProcessingStatus)),
    mergeMap(({ payload: token }) => from(ExpensesService.getReceiptParsingResult(token)).pipe(
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
            description: response.value.description,
            category: response.value.category,
            receiptId: 0, // TODO: Pass proper receipt ID
            value: response.value.value,
          },
        }))
        break
      }
      case 'done':
        observer.next(Actions.imageParsed(response.id))
    }
  }
})

export const parseImageEpic = combineEpics(
  processImageEpic,
  checkImageProcessingStatusEpic,
  processParsedImageEpic,
  receiveExpenseMatchesEpic,
)
