import { combineEpics, Epic, ofType } from 'redux-observable'
import { filter, map, mergeAll, mergeMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { redirect } from 'redux-first-router'
import { of } from 'rxjs'

import { AppAction } from '../../app.actions'
import { clearPageMessages, loadBudgets, updateBudgets } from './page.actions'
import { AppState } from '../../app.store'
import { PageService } from './page.service'
import { AvailableRoutes, RouteAction } from '../../routes'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(loadBudgets)),
    map(() => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets`)
    )),
    mergeMap((request) => of(
      PageService.fetchFromNetwork(request),
      PageService.loadFromCache(request),
    )),
    mergeAll(),
  )

const loadDefaultBudgetEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(updateBudgets)),
    map(({ payload: { budgets } }) => (
      redirect({
        type: AvailableRoutes.BUDGET_MONTH,
        payload: {
          budget: (budgets.find(budget => budget.isDefault) || budgets[0]).slug,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      }) as RouteAction
    )),
  )

const clearErrorsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(...Object.values(AvailableRoutes)),
    map(() => clearPageMessages()),
  )

export const pageEpic = combineEpics(
  pageLoadEpic,
  loadDefaultBudgetEpic,
  clearErrorsEpic,
)
