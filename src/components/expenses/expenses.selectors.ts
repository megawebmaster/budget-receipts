import { AppState } from '../../app.store'

export const expensesReceipts = (state: AppState) => state.expenses.receipts
export const expensesLoading = (state: AppState) => state.expenses.loading

export const createExpenseItemsSelector = (id: number) =>
  (state: AppState) => state.expenses.items[id] || []
