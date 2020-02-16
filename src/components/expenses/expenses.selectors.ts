import { AppState } from '../../app.store'
import { propEq } from 'ramda'

export const expensesReceipts = (state: AppState) => state.expenses.receipts
export const expensesLoading = (state: AppState) => state.expenses.loading

export const createReceiptSelector = (id: number) =>
  (state: AppState) => state.expenses.receipts.find(propEq('id', id))

export const createExpenseItemsSelector = (id: number) =>
  (state: AppState) => state.expenses.items[id] || []
