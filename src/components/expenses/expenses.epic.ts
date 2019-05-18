import { combineEpics, Epic, ofType } from 'redux-observable'
import { getType, isOfType } from 'typesafe-actions'
import { filter, ignoreElements, map, mergeAll, mergeMap, tap } from 'rxjs/operators'
import { of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { addReceiptItem, receiptsLoading } from './expenses.actions'
import { AvailableRoutes, ExpenseRouteAction } from '../../routes'
import { ExpensesService } from './expenses.service'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    map(({ payload: { budget, year, month } }) => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/${month}/receipts`)
    )),
    mergeMap((request) => of(
      Promise.resolve(receiptsLoading({ status: true })),
      ExpensesService.fetchFromNetwork(request),
      ExpensesService.loadFromCache(request),
    )),
    mergeAll(),
  )

const addItemEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isOfType(getType(addReceiptItem))),
    tap(({ payload }) => console.log('add receipt item action', payload)),
    ignoreElements(),
  )

export const expensesEpic = combineEpics(
  pageLoadEpic,
  addItemEpic,
)
