import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'
import { append, filter, propEq } from 'ramda'

import { AppAction } from '../../app.actions'
import { AppMessage, AppMessageType } from '../message-list'
import { Actions as AuthActions } from '../../auth'
import { Budget, BudgetYear } from './budget.types'
import * as Actions from './page.actions'

export type PageState = {
  budgets: Budget[]
  loadingBudgets: boolean
  loadingYears: boolean
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

const loadingBudgetsReducer: Reducer<PageState['loadingBudgets'], AppAction> = (state = true, action) => {
  switch (action.type) {
    case getType(Actions.loadBudgets):
      return true
    case getType(Actions.updateBudgets):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

const loadingYearsReducer: Reducer<PageState['loadingYears'], AppAction> = (state = true, action) => {
  switch (action.type) {
    case getType(Actions.loadBudgets):
      return true
    case getType(Actions.updateBudgetYears):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

const messagesReducer: Reducer<PageState['messages'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.pageError):
      return append(action.payload, state)
    case getType(AuthActions.loginError):
      return append({ text: action.payload, translate: true, sticky: true, type: AppMessageType.ERROR }, state)
    case getType(Actions.clearPageMessages):
      return filter(propEq('sticky', true), state)
    default:
      return state
  }
}

export const reducer = combineReducers({
  budgets: budgetsReducer,
  loadingBudgets: loadingBudgetsReducer,
  loadingYears: loadingYearsReducer,
  messages: messagesReducer,
  years: yearsReducer,
})
