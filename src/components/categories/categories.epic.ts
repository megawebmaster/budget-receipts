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
import { decryptAction, encryptAction } from '../../encryption'
import { createCategorySelector } from './categories.selectors'
import { pick } from 'ramda'

const decryptCategories = decryptAction({
  actionCreator: Actions.updateCategories,
  fields: ['name'],
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.EXPENSES_MONTH),
    distinctUntilChanged(({ payload: { budget: prevBudget } }, { payload: { budget } }) =>
      prevBudget === budget,
    ),
    map(({ payload: { budget } }) => (
      `${process.env.REACT_APP_API_URL}/budgets/${budget}/categories`
    )),
    concatMap((url) => [
      ConnectionService.fetchFromNetwork(url, decryptCategories),
      ConnectionService.loadFromCache(url, decryptCategories),
    ]),
    mergeAll(),
  )

const addCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.addCategory)),
    map(({ payload: { id, name, type, parentId } }) => {
      const parent = parentId ? createCategorySelector(parentId)(state$.value) : null
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return Actions.createCategory({
        id,
        name,
        parent,
        type,
        averageValues: [],
        createdAt: new Date().toString(),
        deletedAt: null,
        startedAt: new Date(year, month - 1).toString(),
      })
    }),
  )

const createCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.createCategory)),
    map(({ payload }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        value: {
          ...payload,
          parent: payload.parent ? pick(['id'], payload.parent) : null,
        },
        params: {
          year,
          month,
        },
        url: `${process.env.REACT_APP_API_URL}/budgets/${budget}/categories`,
      }
    }),
    map(encryptAction({
      api: ConnectionService.create,
      actionCreator: Actions.categoryCreated,
      fields: ['name'],
    })),
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
  addCategoryEpic,
  createCategoryEpic,
  updateCategoryEpic,
  deleteCategoryEpic,
)
