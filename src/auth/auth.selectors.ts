import { AppState } from '../app.store'

export const isLoggingIn = (state: AppState) => state.auth.loggingIn
export const isLoggedIn = (state: AppState) => state.auth.isLogged
