import { AppState } from '../../app.store'

export const budgetLoading = (state: AppState) => state.budget.loading
export const budgetMessages = (state: AppState) => state.budget.messages
