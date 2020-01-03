import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

import { AppAction } from '../../app.actions'
import { AvailableRoutes } from '../../routes'
import { Category } from './category.types'
import { CreateCategory } from './categories.actions'
import * as Actions from './categories.actions'

export type CategoriesState = {
  categories: Category[]
  loading: boolean
}

const newCategory =
  (state: CategoriesState['categories'], { parentId, type, value }: CreateCategory): Category[] => [
    ...state,
    {
      type,
      averageValues: [],
      id: Date.now(),
      name: value,
      parent: parentId ? state.find(category => category.id === parentId) || null : null,
      createdAt: new Date().toString(),
      deletedAt: null,
      startedAt: new Date().toString(),
    },
  ]

const categoriesReducer: Reducer<CategoriesState['categories'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.updateCategories): {
      return action.payload.categories
    }
    case getType(Actions.createCategory): {
      return newCategory(state, action.payload)
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
