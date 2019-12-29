import { combineReducers, Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { indexBy, mergeRight, mergeWith, pipe, prop, toString, values } from 'ramda'

import * as Actions from './budget.actions'
import { BudgetEntry } from './budget-entry.types'

export type BudgetAction = ActionType<typeof Actions>
export type BudgetState = {
  entries: BudgetEntry[]
  loading: boolean
}

const entriesReducer: Reducer<BudgetState['entries'], BudgetAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.loadEntries):
      return []
    case getType(Actions.updateEntries):
      return values(
        mergeWith(
          mergeRight,
          indexBy(pipe(prop('id'), toString), state),
          indexBy(pipe(prop('id'), toString), action.payload.entries),
        ),
      )
    default:
      return state
  }
}

const loadingReducer: Reducer<BudgetState['loading'], BudgetAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.loadEntries):
      return true
    case getType(Actions.updateEntries):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

export const reducer = combineReducers({
  entries: entriesReducer,
  loading: loadingReducer,
})
