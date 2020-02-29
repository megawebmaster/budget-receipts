import { combineReducers, Reducer } from 'redux'

import { AppAction } from '../app.actions'

export type AuthState = {
  isLogged: boolean
  loading: boolean
}

const isLoggedReducer: Reducer<AuthState['isLogged'], AppAction> = (state = true, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const loadingReducer: Reducer<AuthState['loading'], AppAction> = (state = true, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const reducer = combineReducers({
  isLogged: isLoggedReducer,
  loading: loadingReducer,
})
