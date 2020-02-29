import { combineReducers, Reducer } from 'redux'

import { AppAction } from '../app.actions'

export type AuthState = {
  loading: boolean
}

const loadingReducer: Reducer<AuthState['loading'], AppAction> = (state = true, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const reducer = combineReducers({
  loading: loadingReducer,
})
