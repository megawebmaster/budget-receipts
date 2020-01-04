import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, filter, map, mergeAll } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import {
  AvailableRoutes,
  budget as budgetSelector,
  month as monthSelector,
  RouteAction,
  year as yearSelector,
} from '../../routes'
import { ConnectionService } from '../../connection.service'
import * as Actions from './budget.actions'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES),
    map(({ payload: { budget, year, month } }) => (
      `${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/entries/${month}`
    )),
    concatMap((url) => [
      ConnectionService.fetchFromNetwork(url, Actions.updateEntries),
      ConnectionService.loadFromCache(url, Actions.updateEntries),
    ]),
    mergeAll(),
  )

const updateEntryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateEntry)),
    map(({ payload: { categoryId, value, type } }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/budgets/${budget}/${year}/entries/${categoryId}`,
        body: {
          month,
          [type]: value,
        },
      }
    }),
    concatMap(({ url, body }) => ConnectionService.update(url, body)),
  )

export const budgetEpic = combineEpics(
  pageLoadEpic,
  updateEntryEpic,
)
