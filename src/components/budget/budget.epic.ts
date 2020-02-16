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
import { decryptAction, encryptAction } from '../../encryption'
import { createCategoryEntrySelector } from './budget.selectors'

const decryptEntries = decryptAction({
  actionCreator: Actions.updateEntries,
  numericFields: {
    plan: true,
    real: true,
  },
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES),
    map(({ payload: { budget, year, month } }) => (
      `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/entries/${month}`
    )),
    concatMap((url) => [
      ConnectionService.fetchFromNetwork(url, decryptEntries),
      ConnectionService.loadFromCache(url, decryptEntries),
    ]),
    mergeAll(),
  )

const updateEntryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateEntry)),
    map(({ payload: { categoryId, value, type } }) => {
      const entry = createCategoryEntrySelector(categoryId)(state$.value)
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/entries/${month}/${categoryId}`,
        value: {
          ...entry,
          [type]: value,
        },
      }
    }),
    map(encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.entryUpdated,
      fields: {
        plan: true,
        real: true,
      },
    })),
  )

export const budgetEpic = combineEpics(
  pageLoadEpic,
  updateEntryEpic,
)
