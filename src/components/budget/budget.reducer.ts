import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'
import {
  append,
  assoc,
  findIndex,
  indexBy,
  lensIndex,
  map,
  mergeRight,
  mergeWith,
  over,
  path,
  pathEq,
  pipe,
  toString,
  values,
} from 'ramda'
import { AvailableRoutes } from '../../routes'
import { AppAction } from '../../app.actions'

import * as Actions from './budget.actions'
import { BudgetEntry } from './budget-entry.types'
import { categoryCreated, updateCategories } from '../categories'

export type BudgetState = {
  entries: BudgetEntry[]
  loading: boolean
}

const entriesReducer: Reducer<BudgetState['entries'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case AvailableRoutes.BUDGET_MONTH_ENTRIES:
      return []
    case getType(categoryCreated):
      return append({
        category: action.payload.value,
        plan: 0,
        real: 0,
      })(state)
    case getType(updateCategories):
      return values(
        mergeWith(
          mergeRight,
          indexBy(
            pipe(path(['category', 'id']), toString),
            map((category) => ({ category, plan: 0, real: 0 }), action.payload.value),
          ),
          indexBy(pipe(path(['category', 'id']), toString), state),
        ),
      )
    case getType(Actions.updateEntry):
      return over(
        lensIndex(findIndex(pathEq(['category', 'id'], action.payload.categoryId), state)),
        assoc(action.payload.type, action.payload.value),
      )(state)
    case getType(Actions.updateEntries):
      // TODO: Do not update the object if nothing changes: check `assoc`
      return values(
        mergeWith(
          mergeRight,
          indexBy(pipe(path(['category', 'id']), toString), state),
          indexBy(pipe(path(['category', 'id']), toString), action.payload.value),
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
