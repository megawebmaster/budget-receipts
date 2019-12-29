import { combineEpics, Epic, ofType } from 'redux-observable'
import { map } from 'rxjs/operators'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { clearMessages } from './budget.actions'
import { AvailableRoutes, RouteAction } from '../../routes'

// const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
//   action$.pipe(
//     ofType<AppAction, BudgetRouteAction>(AvailableRoutes.BUDGET_MONTH),
//     map(({ payload: { budget, year, month } }) => (
//       new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/${month}/receipts`)
//     )),
//     mergeMap((request) => of(
//       Promise.resolve(receiptsLoading()),
//       ExpensesService.fetchFromNetwork(request),
//       ExpensesService.loadFromCache(request),
//     )),
//     mergeAll(),
//   )

const clearErrorsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(...Object.values(AvailableRoutes)),
    map(() => clearMessages()),
  )

export const budgetEpic = combineEpics(
  // pageLoadEpic,
  clearErrorsEpic,
)
