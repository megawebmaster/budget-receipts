import { createAction } from 'typesafe-actions'

export const login = createAction('AUTH/login')()
export const loggedIn = createAction('AUTH/loggedIn')()
export const loginError = createAction('AUTH/loginError')<string>()
export const loggingIn = createAction('AUTH/loggingIn')()
export const logout = createAction('AUTH/logout')()
