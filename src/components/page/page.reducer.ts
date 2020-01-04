import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'
import { append, filter, propEq } from 'ramda'

import { AppAction } from '../../app.actions'
import { AppMessage } from '../message-list'
import { Budget, BudgetYear } from './budget.types'
import * as Actions from './page.actions'

export type PageState = {
  budgets: Budget[]
  loading: boolean
  messages: AppMessage[]
  years: BudgetYear[]
}

const budgetsReducer: Reducer<PageState['budgets'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.updateBudgets):
      return action.payload.value
    default:
      return state
  }
}

const yearsReducer: Reducer<PageState['years'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.updateBudgetYears):
      return action.payload.value
    default:
      return state
  }
}

const loadingReducer: Reducer<PageState['loading'], AppAction> = (state = true, action) => {
  switch (action.type) {
    case getType(Actions.loadBudgets):
      return true
    case getType(Actions.updateBudgets):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

const messagesReducer: Reducer<PageState['messages'], AppAction> = (state = [], action) => {
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
  years: yearsReducer,
})
