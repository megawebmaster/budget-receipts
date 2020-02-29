import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

import { AppAction } from '../app.actions'
import { Authenticator } from '../app.auth'
import * as Actions from './auth0.actions'

export type AuthState = {
  isLogged: boolean
  loggingIn: boolean
}

const isLoggedReducer: Reducer<AuthState['isLogged'], AppAction> = (state = Authenticator.isLoggedIn(), action) => {
  switch (action.type) {
    case getType(Actions.login):
    case getType(Actions.loggingIn):
    case getType(Actions.loginError):
      return false
    case getType(Actions.loggedIn):
      return true
    default:
      return state
  }
}

const loggingInReducer: Reducer<AuthState['loggingIn'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.loggingIn):
      return true
    case getType(Actions.loggedIn):
    case getType(Actions.loginError):
      return false
    default:
      return state
  }
}

export const reducer = combineReducers({
  isLogged: isLoggedReducer,
  loggingIn: loggingInReducer,
})
