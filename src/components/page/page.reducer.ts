import { combineReducers, Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { append, filter, propEq } from 'ramda'

import { AppMessage } from '../message-list'
import * as Actions from './page.actions'
import { Budget } from './budget.types'

export type PageAction = ActionType<typeof Actions>
export type PageState = {
  budgets: Budget[]
  loading: boolean
  messages: AppMessage[]
}

const budgetsReducer: Reducer<PageState['budgets'], PageAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.updateBudgets):
      return action.payload.budgets
    default:
      return state
  }
}

const loadingReducer: Reducer<PageState['loading'], PageAction> = (state = true, action) => {
  switch (action.type) {
    case getType(Actions.loadBudgets):
      return true
    case getType(Actions.updateBudgets):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

const messagesReducer: Reducer<PageState['messages'], PageAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.pageError):
      return append(action.payload, state)
    case getType(Actions.clearPageMessages):
      return filter(propEq('sticky', true), state)
    default:
      return state
  }
}

export const reducer = combineReducers({
  budgets: budgetsReducer,
  loading: loadingReducer,
  messages: messagesReducer,
})
