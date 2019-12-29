import { AppState } from '../../app.store'

export const budgetLoading = (state: AppState) => state.budget.loading
export const budgetEntries = (state: AppState) => state.budget.entries
