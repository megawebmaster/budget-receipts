import { AppState } from '../../app.store'

export const expensesReceipts = (state: AppState) => state.expenses.receipts
export const expensesLoading = (state: AppState) => state.expenses.loading
export const expensesErrors = (state: AppState) => state.expenses.errors
