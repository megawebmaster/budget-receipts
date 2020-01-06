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
      return action.payload.value
    }
    case getType(Actions.createCategory): {
      return [...state, { ...action.payload, saving: true }]
    }
    case getType(Actions.categoryCreated): {
      const { currentId, value } = action.payload
      // TODO: Ramdify it
      return state.map(category => category.id === currentId ? value : category)
    }
    case getType(Actions.updateCategory): {
      const { id, ...values } = action.payload
      // TODO: Ramdify it
      return state.map(category =>
        category.id === id
          ? {
            ...category,
            ...values,
          }
          : category,
      )
    }
    case getType(Actions.deleteCategory): {
      return state.filter(category => category.id !== action.payload.id)
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
