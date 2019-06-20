import { combineEpics, Epic, ofType } from 'redux-observable'
import { catchError, delay, filter, map, mergeAll, mergeMap, switchMap } from 'rxjs/operators'
import { from, of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import {
  checkProcessingStatus,
  clearMessages,
  processParsedImage,
  processReceiptImage,
  receiptsLoading,
} from './expenses.actions'
import { AvailableRoutes, ExpenseRouteAction } from '../../routes'
import { ExpensesService } from './expenses.service'
import { getType, isOfType } from 'typesafe-actions'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    map(({ payload: { budget, year, month } }) => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/${month}/receipts`)
    )),
    mergeMap((request) => of(
      Promise.resolve(receiptsLoading()),
      ExpensesService.fetchFromNetwork(request),
      ExpensesService.loadFromCache(request),
    )),
    mergeAll(),
  )

const clearErrorsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(action => Object.values(AvailableRoutes).includes(action.type)),
    map(() => clearMessages()),
  )

const processImageEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isOfType(getType(processReceiptImage))),
    mergeMap(({ payload }) => ExpensesService.parseReceiptImage(payload)),
    map(token => checkProcessingStatus(token)),
  )

const checkImageProcessingStatusEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isOfType(getType(checkProcessingStatus))),
    switchMap(({ payload }) => from(ExpensesService.getReceiptParsingResult(payload)).pipe(
      map(result => processParsedImage(result)),
      catchError(() => of(checkProcessingStatus(payload)).pipe(delay(10000))),
    )),
  )

export const expensesEpic = combineEpics(
  pageLoadEpic,
  clearErrorsEpic,
  processImageEpic,
  checkImageProcessingStatusEpic
)
