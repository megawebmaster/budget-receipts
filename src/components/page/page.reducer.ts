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

const budgets: Budget[] = [{
  'id': 1,
  'userId': 'email|5ad319273020501cd4911d4f',
  'name': 'Domowy',
  'slug': 'domowy',
  'isDefault': true,
  'abilities': null,
  'recipient': '',
  // 'recipient': 'wy4ECQMIG9m7lsyLSatgWtJvW5i79Y2Ff3h1bnMWQxlU92zTXdlEsvyLR7c+8IR60k8BN9+0INohjhE3dd7scsIUH6zqsMEy12lPHWEgHfLUq6K\/rzTT5HrlfdbxJAln5uEq+2kFqy0vVfbWlVriGch+4jRoc8pP2WBDix4aiZW+',
  'ownerId': 'email|5ad319273020501cd4911d4f',
}]

const budgetsReducer: Reducer<PageState['budgets'], AppAction> = (state = budgets, action) => {
  switch (action.type) {
    case getType(Actions.updateBudgets):
      return action.payload.value
    default:
      return state
  }
}

const years: BudgetYear[] = [2019, 2020]
const yearsReducer: Reducer<PageState['years'], AppAction> = (state = years, action) => {
  switch (action.type) {
    case getType(Actions.updateBudgetYears):
      return action.payload.value
    default:
      return state
  }
}

// TODO: Restore state value and route reset to true
const loadingReducer: Reducer<PageState['loading'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.loadBudgets):
      return false
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
