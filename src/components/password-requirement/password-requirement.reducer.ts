import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

import { AppAction } from '../../app.actions'
import { Actions as EncryptionActions } from '../../encryption'
import * as Actions from './password-requirement.actions'

export type PasswordState = {
  visible: boolean
}

const visibleReducer: Reducer<PasswordState['visible'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.requirePassword):
      return true
    case getType(EncryptionActions.setPassword):
      return false
    default:
      return state
  }
}

export const reducer = combineReducers({
  visible: visibleReducer,
})
