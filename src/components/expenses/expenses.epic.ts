import { combineEpics, Epic, ofType } from 'redux-observable'
import { isActionOf } from 'typesafe-actions'
import { concatMap, filter, map, mergeAll, mergeMap } from 'rxjs/operators'
import { of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import * as Actions from './expenses.actions'
import {
  AvailableRoutes,
  budget as budgetSelector,
  ExpenseRouteAction,
  month as monthSelector,
  year as yearSelector,
} from '../../routes'
import { ConnectionService } from '../../connection.service'
import { decryptAction, encryptAction } from '../../encryption'
import { createReceiptSelector } from './expenses.selectors'
import { ApiRequest } from '../../connection.types'
import { ApiReceipt, Receipt } from './receipt.types'

const decryptReceipts = decryptAction({
  actionCreator: Actions.updateReceipts,
  fields: {
    shop: true,
  },
})
const decryptReceiptItems = decryptAction({
  actionCreator: Actions.updateReceiptItems,
  fields: {
    description: true,
  },
  numericFields: {
    value: true,
  },
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    map(({ payload: { budget, year, month } }) => (
      `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}`
    )),
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
    map(({ payload }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        value: {
          ...payload.receipt,
          items: payload.items
        },
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}`,
      }
    }),
    map(encryptAction({
      api: ConnectionService.create,
      actionCreator: Actions.receiptCreated,
      fields: {
        shop: true,
        items: {
          value: true,
          description: true,
        }
      }
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

      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

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
    map(encryptAction({
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
    map(({ payload }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${payload}`,
        body: {},
      }
    }),
    concatMap(({ url, body }) => ConnectionService.delete(url, body)),
  )

const createReceiptItemEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.addReceiptItem)),
    map(({ payload }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        value: payload.value,
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${payload.id}/items`,
      }
    }),
    map(encryptAction({
      api: ConnectionService.create,
      actionCreator: Actions.receiptItemCreated,
      fields: {
        value: true,
        description: true,
      }
    })),
  )

const deleteReceiptItemEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.deleteReceiptItem)),
    map(({ payload: { id, itemId } }) => {
      const budget = budgetSelector(state$.value)
      const year = yearSelector(state$.value)
      const month = monthSelector(state$.value)

      return {
        url: `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}/${id}/items/${itemId}`,
        body: {},
      }
    }),
    concatMap(({ url, body }) => ConnectionService.delete(url, body)),
  )

export const expensesEpic = combineEpics(
  pageLoadEpic,
  loadReceiptsFromApiEpic,
  createReceiptEpic,
  updateReceiptEpic,
  deleteReceiptEpic,
  createReceiptItemEpic,
  deleteReceiptItemEpic,
)
