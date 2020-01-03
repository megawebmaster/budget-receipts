import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, distinctUntilChanged, filter, map, mergeAll } from 'rxjs/operators'
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
import * as Actions from './categories.actions'
import { ConnectionService } from '../../connection.service'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.EXPENSES_MONTH),
    distinctUntilChanged(({ payload: { budget: prevBudget } }, { payload: { budget } }) => prevBudget === budget),
    map(({ payload: { budget } }) => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/categories`)
    )),
    concatMap((request) => [
      ConnectionService.fetchFromNetwork(request, Actions.updateCategories),
      ConnectionService.loadFromCache(request, Actions.updateCategories),
    ]),
    mergeAll(),
  )

const createCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.createCategory)),
    map(({ payload: { value, type, parentId } }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/budgets/${budget}/categories`,
        body: {
          type,
          year,
          month,
          parentId,
          name: value,
        },
      }
    }),
    concatMap(({ url, body }) => ConnectionService.create(url, body)),
  )

export const categoriesEpic = combineEpics(
  pageLoadEpic,
  createCategoryEpic,
)
