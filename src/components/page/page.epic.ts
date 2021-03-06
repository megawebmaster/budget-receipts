import { combineEpics, Epic, ofType } from 'redux-observable'
import { distinctUntilChanged, filter, map, mergeAll, mergeMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { redirect } from 'redux-first-router'

import { AppAction } from '../../app.actions'
import { AppState } from '../../app.store'
import { ConnectionService } from '../../connection.service'
import { AvailableRoutes, RouteAction, Selectors as RouteSelectors } from '../../routes'
import * as Actions from './page.actions'

const loadBudgetsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.loadBudgets)),
    map(() => (
      `${process.env.REACT_APP_API_URL}/v2/budgets`
    )),
    mergeMap((url) => [
      ConnectionService.fetchFromNetwork(url, Actions.updateBudgets),
      ConnectionService.loadFromCache(url, Actions.updateBudgets),
    ]),
    mergeAll(),
  )

const loadBudgetYearsEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([Actions.loadBudgets, Actions.updateBudgets])),
    map(() => RouteSelectors.budget(state$.value)),
    distinctUntilChanged(),
    filter(Boolean), // This filters cases where budget is `undefined` as we are redirecting to default budget
    map(budget => (
      `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}`
    )),
    mergeMap((url) => [
      ConnectionService.fetchFromNetwork(url, Actions.updateBudgetYears),
      ConnectionService.loadFromCache(url, Actions.updateBudgetYears),
    ]),
    mergeAll(),
  )

const loadDefaultBudgetEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateBudgets)),
    filter(() => RouteSelectors.location(state$.value) === AvailableRoutes.HOME),
    map(({ payload: { value } }) => (
      redirect({
        type: AvailableRoutes.BUDGET_MONTH_ENTRIES,
        payload: {
          budget: (value.find(budget => budget.isDefault) || value[0]).slug,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      }) as RouteAction
    )),
  )

const clearErrorsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(...Object.values(AvailableRoutes)),
    map(() => Actions.clearPageMessages()),
  )

export const pageEpic = combineEpics(
  loadBudgetsEpic,
  loadBudgetYearsEpic,
  loadDefaultBudgetEpic,
  clearErrorsEpic,
)
