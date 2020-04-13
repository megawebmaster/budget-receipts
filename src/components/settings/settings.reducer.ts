import { combineReducers, Reducer } from 'redux'

import { AppAction } from '../../app.actions'

export type SettingsState = {
  currency: string
}

const currencyReducer: Reducer<SettingsState['currency'], AppAction> = (state = 'PLN', action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const reducer = combineReducers({
  currency: currencyReducer,
})
