import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, distinctUntilChanged, filter, map, mergeAll } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { pick } from 'ramda'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, RouteAction, Selectors as RouteSelectors } from '../../routes'
import { ConnectionService } from '../../connection.service'
import { decryptAction, encryptAction } from '../../encryption'
import { ApiRequest } from '../../connection.types'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../auth'

import * as Actions from './categories.actions'
import { Category } from './category.types'
import { createCategorySelector } from './categories.selectors'

const decryptCategories = decryptAction({
  actionCreator: Actions.updateCategories,
  fields: {
    name: true,
  },
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.EXPENSES_MONTH),
    filter(() => AuthSelectors.isLoggedIn(state$.value)),
    map(() => Actions.loadCategories())
  )

const loadCategoriesEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([Actions.loadCategories, AuthActions.loggedIn])),
    map(() => RouteSelectors.budget(state$.value)),
    filter(Boolean), // This filters cases where budget is `undefined` as we are redirecting to default budget
    distinctUntilChanged((prevBudget, budget) => prevBudget === budget),
    map((budget) => (
      `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/categories`
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
      const year = RouteSelectors.year(state$.value)
      const month = RouteSelectors.month(state$.value)

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
      const budget = RouteSelectors.budget(state$.value)
      const year = RouteSelectors.year(state$.value)
      const month = RouteSelectors.month(state$.value)

      return {
        value: {
          ...payload,
          parent: payload.parent ? pick(['id'], payload.parent) : null,
        },
        params: {
          year,
          month,
        },
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/categories`,
      }
    }),
    map(encryptAction({
      api: ConnectionService.create,
      actionCreator: Actions.categoryCreated,
      fields: {
        name: true,
      },
    })),
  )

const updateCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateCategory)),
    map(({ payload }) => {
      const currentCategory = createCategorySelector(payload.id)(state$.value)

      if (!currentCategory) {
        return null
      }

      const budget = RouteSelectors.budget(state$.value)
      const parent = payload.parent ?? currentCategory.parent

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/categories/${payload.id}`,
        value: {
          ...currentCategory,
          name: payload.name ?? currentCategory.name,
          type: payload.type ?? currentCategory.type,
          parent: parent ? pick(['id'], parent) : null,
        },
      }
    }),
    filter((result: ApiRequest<Category> | null): result is ApiRequest<Category> => Boolean(result)),
    map(encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.categoryUpdated,
      fields: {
        name: true,
      },
    })),
  )

const deleteCategoryEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.deleteCategory)),
    concatMap(({ payload: { id, type } }) => {
      const budget = RouteSelectors.budget(state$.value)
      const year = RouteSelectors.year(state$.value)
      const month = RouteSelectors.month(state$.value)

      return ConnectionService.delete({
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/categories/${id}`,
        params: {
          year,
          month,
          type,
        },
      })
    }),
  )

export const categoriesEpic = combineEpics(
  pageLoadEpic,
  loadCategoriesEpic,
  addCategoryEpic,
  createCategoryEpic,
  updateCategoryEpic,
  deleteCategoryEpic,
)
