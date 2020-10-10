import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, filter, map, mergeAll } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, RouteAction, Selectors as RouteSelectors } from '../../routes'
import { ConnectionService } from '../../connection.service'
import { Actions as EncryptionActions } from '../../encryption'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../auth'
import { Selectors as SettingsSelectors } from '../settings'
import { budgetEntries, createCategoryEntrySelector } from './budget.selectors'

import * as Actions from './budget.actions'

const decryptEntries = EncryptionActions.decryptAction({
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
      const irregularDivisor = SettingsSelectors.irregularDivisor(state$.value)
      const entry = createCategoryEntrySelector(categoryId)(state$.value)
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)
      const url = `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/entries/${month}/${categoryId}`

      if (entry.category.type === 'irregular' && type === 'plan') {
        return {
          url,
          value: {
            ...entry,
            plan: value,
            planMonthly: value / irregularDivisor,
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
    map(EncryptionActions.encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.entryUpdated,
      fields: {
        plan: true,
        planMonthly: true,
        real: true,
      },
    })),
  )

const reencryptEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(() => state$.value.location.type === AvailableRoutes.BUDGET_MONTH_ENTRIES),
    filter(isActionOf(EncryptionActions.updateEncryption)),
    map(() => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      return budgetEntries(state$.value)
        .filter(v => !v.webCrypto)
        .filter(v => v.category.type !== 'irregular')
        .map(v => ({
          url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/entries/${month}/${v.category.id}`,
          value: v,
        }))
    }),
    mergeAll(),
    map(EncryptionActions.encryptAction({
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
  reencryptEpic,
)
