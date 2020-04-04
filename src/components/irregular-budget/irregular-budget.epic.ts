import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, filter, map, mergeAll } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { groupBy, map as mapItems, path, pipe, reduce, toString, values } from 'ramda'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, RouteAction, Selectors as RouteSelectors } from '../../routes'
import { ConnectionService } from '../../connection.service'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../auth'
import { Actions as EncryptionActions } from '../../encryption'
import * as BudgetActions from '../budget/budget.actions'

import * as Actions from './irregular-budget.actions'
import { BudgetEntry } from '../budget/budget-entry.types'

const decryptEntries = EncryptionActions.decryptAction({
  actionCreator: Actions.updateEntries,
  numericFields: {
    plan: true,
    real: true,
  },
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_IRREGULAR),
    filter(() => AuthSelectors.isLoggedIn(state$.value)),
    map(() => Actions.loadEntries()),
  )

const loadEntriesEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([Actions.loadEntries, AuthActions.loggedIn])),
    filter(() => RouteSelectors.location(state$.value) === AvailableRoutes.BUDGET_IRREGULAR),
    map(() => {
      const { budget, year } = RouteSelectors.budgetParams(state$.value)

      return `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/irregular-entries`
    }),
    concatMap((url) => [
      ConnectionService.fetchFromNetwork(url, decryptEntries),
      ConnectionService.loadFromCache(url, decryptEntries),
    ]),
    mergeAll(),
  )

const prepareIrregularEntriesEpic: Epic<AppAction, AppAction, AppState> = action$ =>
  action$.pipe(
    filter(isActionOf(Actions.updateEntries)),
    map(({ payload }) => {
      const groups = pipe(
        groupBy<BudgetEntry>(pipe(path(['category', 'id']), toString)),
        values,
        mapItems(
          reduce<BudgetEntry, BudgetEntry>(
            (result, item) => ({
              ...item,
              month: 0,
              plan: item.month === null ? item.plan : result.plan,
              real: result.real + item.real,
            }),
            {
              id: 0,
              category: { id: 0, type: 'income', parent: null },
              month: 0,
              plan: 0,
              real: 0,
              monthlyRealValues: [],
            },
          ),
        ),
      )(payload.value)

      return BudgetActions.updateEntries({
        source: payload.source,
        value: groups,
      })
    }),
  )

export const irregularBudgetEpic = combineEpics(
  pageLoadEpic,
  loadEntriesEpic,
  prepareIrregularEntriesEpic,
)
