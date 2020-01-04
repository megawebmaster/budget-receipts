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
    distinctUntilChanged(({ payload: { budget: prevBudget } }, { payload: { budget } }) =>
      prevBudget === budget,
    ),
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
    map(({ payload: { id, value, type, parentId } }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        body: {
          type,
          year,
          month,
          parentId,
          name: value,
        },
        currentId: id,
        url: `${process.env.REACT_APP_API_URL}/budgets/${budget}/categories`,
      }
    }),
    concatMap(({ body, currentId, url }) =>
      ConnectionService.create(currentId, url, body, Actions.categoryCreated)
    ),
  )

const updateCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateCategory)),
    map(({ payload: { id, ...values } }) => {
      const budget = budgetSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/budgets/${budget}/categories/${id}`,
        body: values,
      }
    }),
    concatMap(({ url, body }) => ConnectionService.update(url, body)),
  )

const deleteCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.deleteCategory)),
    map(({ payload: { id, type } }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/budgets/${budget}/categories/${id}`,
        body: {
          year,
          month,
          type,
        },
      }
    }),
    concatMap(({ url, body }) => ConnectionService.delete(url, body)),
  )

export const categoriesEpic = combineEpics(
  pageLoadEpic,
  createCategoryEpic,
  updateCategoryEpic,
  deleteCategoryEpic,
)
