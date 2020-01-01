import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, map, mergeAll } from 'rxjs/operators'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, RouteAction } from '../../routes'
import { BudgetEntryService } from './budget.service'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES),
    map(({ payload: { budget, year, month } }) => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/entries/${month}`)
    )),
    concatMap((request) => [
      BudgetEntryService.fetchFromNetwork(request),
      BudgetEntryService.loadFromCache(request),
    ]),
    mergeAll(),
  )

export const budgetEpic = combineEpics(
  pageLoadEpic,
)
