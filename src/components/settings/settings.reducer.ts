import { combineReducers, Reducer } from 'redux'

import { AppAction } from '../../app.actions'

export type SettingsState = {
  currency: string
  irregularDivisor: number
}

// TODO: Build a settings window to allow changing currency
const currencyReducer: Reducer<SettingsState['currency'], AppAction> = (state = 'PLN', action) => {
  switch (action.type) {
    default:
      return state
  }
}

// TODO: Build a settings window to allow changing irregular divisor
// TODO: Remember to recalculate irregular values
const irregularDivisorReducer: Reducer<SettingsState['irregularDivisor'], AppAction> = (state = 10, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const reducer = combineReducers({
  currency: currencyReducer,
  irregularDivisor: irregularDivisorReducer,
})
