import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

import { AppAction } from '../../app.actions'
import { AvailableRoutes } from '../../routes'
import { Category } from './category.types'
import * as Actions from './categories.actions'

export type CategoriesState = {
  categories: Category[]
  loading: boolean
}

const categoriesReducer: Reducer<CategoriesState['categories'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.updateCategories): {
      return action.payload.categories
    }
    case getType(Actions.addCategory): {
      return [...state, action.payload]
    }
    default:
      return state
  }
}

const loadingReducer: Reducer<CategoriesState['loading'], AppAction> = (state = true, action) => {
  switch (action.type) {
    case AvailableRoutes.BUDGET:
      return true
    case getType(Actions.updateCategories):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

export const reducer = combineReducers({
  categories: categoriesReducer,
  loading: loadingReducer,
})
