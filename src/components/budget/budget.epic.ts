import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, filter, map, mergeAll } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, RouteAction, Selectors as RouteSelectors } from '../../routes'
import { ConnectionService } from '../../connection.service'
import { decryptAction, encryptAction } from '../../encryption'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../auth'

import * as Actions from './budget.actions'
import { createCategoryEntrySelector } from './budget.selectors'

const decryptEntries = decryptAction({
  actionCreator: Actions.updateEntries,
  numericFields: {
    plan: true,
    real: true,
  },
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.BUDGET_IRREGULAR),
    filter(() => AuthSelectors.isLoggedIn(state$.value)),
    map(() => Actions.loadEntries()),
  )

const loadEntriesEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([Actions.loadEntries, AuthActions.loggedIn])),
    filter(() =>
      [AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.BUDGET_IRREGULAR]
        .includes(RouteSelectors.location(state$.value))
    ),
    map(() => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      return `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/entries/${month}`
    }),
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
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)
      const url = `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/entries/${month}/${categoryId}`

      if (entry.category.type === 'irregular' && type === 'plan') {
        return {
          url,
          value: {
            ...entry,
            plan: value,
            planMonthly: value / 10 // TODO: Support dividing irregular by 12
          },
        }
      }

      return {
        url,
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
        planMonthly: true,
        real: true,
      },
    })),
  )

export const budgetEpic = combineEpics(
  pageLoadEpic,
  loadEntriesEpic,
  updateEntryEpic,
)
