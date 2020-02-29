import { AppState } from '../app.store'

export const isLoading = (state: AppState) => state.auth.loading
