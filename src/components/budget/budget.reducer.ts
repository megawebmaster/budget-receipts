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
import { Actions as CategoryActions } from '../categories'

import * as Actions from './budget.actions'
import { BudgetEntry } from './budget-entry.types'

export type BudgetState = {
  entries: BudgetEntry[]
  loading: boolean
}

const entriesReducer: Reducer<BudgetState['entries'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case AvailableRoutes.BUDGET_IRREGULAR:
    case AvailableRoutes.BUDGET_MONTH_ENTRIES:
      return state.map(({ category }) => ({ category, plan: 0, real: 0 }))
    case getType(CategoryActions.categoryCreated):
      return append({
        category: action.payload.value,
        plan: 0,
        real: 0,
      })(state)
    case getType(CategoryActions.updateCategories):
      return values(
        mergeWith(
          mergeRight,
          indexBy(
            pipe(path(['category', 'id']), toString),
            map(
              (category) => ({ category, plan: 0, real: 0 }),
              action.payload.value.filter((category) => category.children?.length === 0),
            ),
          ),
          indexBy(pipe(path(['category', 'id']), toString), state),
        ),
      )
    case getType(Actions.updateEntry): {
      const idx = findIndex(pathEq(['category', 'id'], action.payload.categoryId), state)

      if (idx === -1) {
        return state
      }

      return over(
        lensIndex(idx),
        assoc(action.payload.type, action.payload.value),
      )(state)
    }
    case getType(Actions.entryUpdated): {
      const idx = findIndex(pathEq(['category', 'id'], action.payload.value.category.id), state)

      if (idx === -1) {
        return state
      }

      return over(
        lensIndex(idx),
        assoc('id', action.payload.value.id),
      )(state)
    }
    case getType(Actions.updateEntries):
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
    case AvailableRoutes.BUDGET_IRREGULAR:
      return true
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
