import { combineEpics, Epic, ofType } from 'redux-observable'
import { isActionOf } from 'typesafe-actions'
import { concatMap, filter, map, mergeAll, mergeMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { flatten, prop, values } from 'ramda'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, ExpenseRouteAction, Selectors as RouteSelectors } from '../../routes'
import { ConnectionService } from '../../connection.service'
import { Actions as EncryptionActions } from '../../encryption'
import { ApiRequest } from '../../connection.types'
import { Selectors as CategorySelectors } from '../categories'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../auth'

import * as Actions from './expenses.actions'
import { ExpenseDeleted, ReceiptItemCreated } from './expenses.actions'
import {
  createCategorySpentSelector,
  createReceiptItemSelector,
  createReceiptSelector,
  expensesReceiptItems,
  expensesReceipts,
} from './expenses.selectors'
import { ApiReceipt, ReceiptItem } from './receipt.types'

const decryptReceipts = EncryptionActions.decryptAction({
  actionCreator: Actions.updateReceipts,
  fields: {
    shop: true,
  },
})
const decryptReceiptItems = EncryptionActions.decryptAction({
  actionCreator: Actions.updateReceiptItems,
  fields: {
    description: true,
  },
  numericFields: {
    value: true,
  },
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    filter(() => AuthSelectors.isLoggedIn(state$.value)),
    map(() => Actions.loadReceipts()),
  )

const loadReceiptsEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([Actions.loadReceipts, AuthActions.loggedIn])),
    filter(() => RouteSelectors.location(state$.value) === AvailableRoutes.EXPENSES_MONTH),
    map(() => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      return `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}`
    }),
    mergeMap((url) => of(
      ConnectionService.loadFromCache(url, Actions.loadReceiptsFromApi),
      ConnectionService.fetchFromNetwork(url, Actions.loadReceiptsFromApi),
    )),
    mergeAll(),
  )

const loadReceiptsFromApiEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.loadReceiptsFromApi)),
    concatMap(({ payload: { source, value } }) => [
      decryptReceipts({ source, value }),
      ...value.map((receipt) => decryptReceiptItems({ source, value: receipt.items || [] })),
    ]),
  )

const createReceiptEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.addReceipt)),
    map(({ payload: { receipt, items } }) => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      const updatedCategories = items.map(prop('categoryId'))
      const budgetValues = updatedCategories.map(
        categoryId => ({ categoryId, value: createCategorySpentSelector(categoryId)(state$.value) }),
      )

      return {
        value: {
          ...receipt,
          items,
          budgetValues,
        },
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}`,
      }
    }),
    map(EncryptionActions.encryptAction({
      api: ConnectionService.create,
      actionCreator: Actions.receiptCreated,
      fields: {
        shop: true,
        items: {
          value: true,
          description: true,
        },
        budgetValues: {
          value: true,
        },
      },
    })),
  )

const updateReceiptEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateReceipt)),
    map(({ payload }) => {
      const currentReceipt = createReceiptSelector(payload.id)(state$.value)

      if (!currentReceipt) {
        return null
      }

      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${payload.id}`,
        value: {
          ...currentReceipt,
          day: payload.day ?? currentReceipt.day,
          shop: payload.shop ?? currentReceipt.shop,
          items: [],
        },
      }
    }),
    filter((result: ApiRequest<ApiReceipt> | null): result is ApiRequest<ApiReceipt> => Boolean(result)),
    map(EncryptionActions.encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.receiptUpdated,
      fields: {
        shop: true,
      },
    })),
  )

const deleteReceiptEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.deleteReceipt)),
    map(({ payload: id }) => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      const updatedCategories = CategorySelectors.receiptCategories(state$.value).map(prop('id'))
      const budgetValues = updatedCategories.map(
        categoryId => ({ categoryId, value: createCategorySpentSelector(categoryId)(state$.value) }),
      )

      return {
        value: {
          id,
          budgetValues,
        },
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${id}`,
      }
    }),
    map(EncryptionActions.encryptAction<ExpenseDeleted>({
      api: ConnectionService.delete,
      fields: {
        budgetValues: {
          value: true,
        },
      },
    })),
  )

const createReceiptItemEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.addReceiptItem)),
    map(({ payload }) => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      const budgetValues = [{
        categoryId: payload.value.categoryId,
        value: createCategorySpentSelector(payload.value.categoryId)(state$.value),
      }]

      return {
        value: {
          ...payload.value,
          budgetValues,
        },
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${payload.id}/items`,
      }
    }),
    map(EncryptionActions.encryptAction({
      api: ConnectionService.create,
      actionCreator: Actions.receiptItemCreated,
      fields: {
        value: true,
        description: true,
        budgetValues: {
          value: true,
        },
      },
    })),
  )

const updateReceiptItemEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.updateReceiptItem)),
    map(({ payload }) => {
      const currentItem = createReceiptItemSelector(payload.id, payload.itemId)(state$.value)

      if (!currentItem) {
        return null
      }

      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      const updatedCategories = CategorySelectors.receiptCategories(state$.value).map(prop('id'))
      const budgetValues = updatedCategories.map(
        categoryId => ({ categoryId, value: createCategorySpentSelector(categoryId)(state$.value) }),
      )

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${payload.id}/items/${payload.itemId}`,
        value: {
          ...currentItem,
          budgetValues,
          categoryId: payload.value.categoryId ?? currentItem.categoryId,
          value: payload.value.value ?? currentItem.value,
          description: payload.value.description ?? currentItem.description,
        },
      }
    }),
    filter((result: ApiRequest<ReceiptItemCreated> | null): result is ApiRequest<ReceiptItemCreated> => Boolean(result)),
    map(EncryptionActions.encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.receiptItemUpdated,
      fields: {
        value: true,
        description: true,
        budgetValues: {
          value: true,
        },
      },
    })),
  )

const deleteReceiptItemEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.deleteReceiptItem)),
    map(({ payload: { id, itemId } }) => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      const updatedCategories = CategorySelectors.receiptCategories(state$.value).map(prop('id'))
      const budgetValues = updatedCategories.map(
        categoryId => ({ categoryId, value: createCategorySpentSelector(categoryId)(state$.value) }),
      )

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${id}/items/${itemId}`,
        value: {
          id: itemId,
          budgetValues,
        },
      }
    }),
    map(EncryptionActions.encryptAction<ExpenseDeleted>({
      api: ConnectionService.delete,
      fields: {
        budgetValues: {
          value: true,
        },
      },
    })),
  )

const reencryptReceiptsEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(() => state$.value.location.type === AvailableRoutes.EXPENSES_MONTH),
    filter(isActionOf(EncryptionActions.updateEncryption)),
    map(() => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)

      const r = expensesReceipts(state$.value)
        .filter(v => !v.webCrypto)
        .map(v => ({
          url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${v.id}`,
          value: {
            ...v,
            items: [],
          },
        }))
      console.log('expense receipts', r)

      return r
    }),
    mergeAll(),
    map(EncryptionActions.encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.receiptUpdated,
      fields: {
        shop: true,
      },
    })),
  )

const reencryptReceiptItemsEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(() => state$.value.location.type === AvailableRoutes.EXPENSES_MONTH),
    filter(isActionOf(EncryptionActions.updateEncryption)),
    map(() => {
      const { budget, year, month } = RouteSelectors.budgetParams(state$.value)
      const updatedCategories = CategorySelectors.receiptCategories(state$.value).map(prop('id'))
      const budgetValues = updatedCategories.map(
        categoryId => ({ categoryId, value: createCategorySpentSelector(categoryId)(state$.value) }),
      )

      return flatten<ReceiptItem[][]>(values(expensesReceiptItems(state$.value)))
        .filter(v => !v.webCrypto)
        .map(v => ({
          url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${v.receiptId}/items/${v.id}`,
          value: {
            ...v,
            budgetValues,
          },
        }))
    }),
    mergeAll(),
    map(EncryptionActions.encryptAction({
      api: ConnectionService.update,
      actionCreator: Actions.receiptItemUpdated,
      fields: {
        value: true,
        description: true,
        budgetValues: {
          value: true,
        },
      },
    })),
  )

export const expensesEpic = combineEpics(
  pageLoadEpic,
  loadReceiptsEpic,
  loadReceiptsFromApiEpic,
  createReceiptEpic,
  updateReceiptEpic,
  deleteReceiptEpic,
  createReceiptItemEpic,
  updateReceiptItemEpic,
  deleteReceiptItemEpic,
  reencryptReceiptsEpic,
  reencryptReceiptItemsEpic,
)
