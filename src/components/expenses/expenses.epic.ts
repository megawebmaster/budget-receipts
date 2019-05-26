import { combineEpics, Epic, ofType } from 'redux-observable'
import { filter, map, mergeAll, mergeMap } from 'rxjs/operators'
import { of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { clearMessages, receiptsLoading } from './expenses.actions'
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

const clearErrorsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(action => Object.values(AvailableRoutes).includes(action.type)),
    map(() => clearMessages()),
  )

export const expensesEpic = combineEpics(
  pageLoadEpic,
  clearErrorsEpic,
)
