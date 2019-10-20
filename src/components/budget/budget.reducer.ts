import { combineReducers, Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { append, filter, propEq } from 'ramda'

import { AppMessage } from '../message-list'
import * as Actions from './budget.actions'

export type BudgetAction = ActionType<typeof Actions>
export type BudgetState = {
  loading: boolean,
  messages: AppMessage[]
}

const messagesReducer: Reducer<BudgetState['messages'], BudgetAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.receiptsLoadingError):
      return append(action.payload, state)
    case getType(Actions.clearMessages):
      return filter(propEq('sticky', true), state)
    default:
      return state
  }
}

const loadingReducer: Reducer<BudgetState['loading'], BudgetAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.receiptsLoading):
      return true
    case getType(Actions.receiptsLoadingError):
      return false
    default:
      return state
  }
}

export const reducer = combineReducers({
  messages: messagesReducer,
  loading: loadingReducer,
})
