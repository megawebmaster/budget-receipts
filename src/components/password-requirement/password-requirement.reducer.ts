import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'
import { AppAction } from '../../app.actions'

import * as Actions from './password-requirement.actions'
import { AfterAction } from './password-requirement.actions'
import { setEncryptionPassword } from '../../encryption'

export type PasswordState = {
  actions: AfterAction[]
  processing: boolean
  visible: boolean
}

const actionsReducer: Reducer<PasswordState['actions'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.requirePassword):
      return [...state, action.payload]
    case getType(Actions.continueActions):
      return []
    default:
      return state
  }
}

const processingReducer: Reducer<PasswordState['processing'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case getType(setEncryptionPassword):
      return true
    case getType(Actions.continueActions):
      return false
    default:
      return state
  }
}

const visibleReducer: Reducer<PasswordState['visible'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.requirePassword):
      return true
    case getType(Actions.continueActions):
      return false
    default:
      return state
  }
}

export const reducer = combineReducers({
  actions: actionsReducer,
  processing: processingReducer,
  visible: visibleReducer,
})
