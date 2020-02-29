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
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES),
    filter(() => AuthSelectors.isLoggedIn(state$.value)),
    map(() => Actions.loadEntries()),
  )

const loadEntriesEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([Actions.loadEntries, AuthActions.loggedIn])),
    filter(() => RouteSelectors.location(state$.value) === AvailableRoutes.BUDGET_MONTH_ENTRIES),
    map(() => {
      // TODO: Maybe it's worth to extract it to a separate selector?
      const budget = RouteSelectors.budget(state$.value)
      const year = RouteSelectors.year(state$.value)
      const month = RouteSelectors.month(state$.value)

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
      const budget = RouteSelectors.budget(state$.value)
      const year = RouteSelectors.year(state$.value)
      const month = RouteSelectors.month(state$.value)

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
  loadEntriesEpic,
  updateEntryEpic,
)
