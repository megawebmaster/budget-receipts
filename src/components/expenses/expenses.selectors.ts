import { AppState } from '../../app.store'

export const expensesReceipts = (state: AppState) => state.expenses.receipts
export const expensesLoading = (state: AppState) => state.expenses.loading
export const expenseItems = (state: AppState, id: number) => state.expenses.items[id] || []
