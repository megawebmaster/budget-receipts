import { combineReducers, Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { indexBy, mergeRight, mergeWith, pipe, prop, toString, values } from 'ramda'
import { AvailableRoutes } from '../../routes'
import { AppAction } from '../../app.actions'

import * as Actions from './budget.actions'
import { BudgetEntry } from './budget-entry.types'

export type BudgetAction = ActionType<typeof Actions>
export type BudgetState = {
  entries: BudgetEntry[]
  loading: boolean
}

const entriesReducer: Reducer<BudgetState['entries'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case AvailableRoutes.BUDGET_MONTH_ENTRIES:
      return []
    case getType(Actions.updateEntries):
      // TODO: Do not update the object if nothing changes
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

const loadingReducer: Reducer<BudgetState['loading'], AppAction> = (state = true, action) => {
  switch (action.type) {
    case AvailableRoutes.BUDGET_MONTH_ENTRIES:
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
