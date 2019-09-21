import { Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import * as Actions from './categories.actions'
import { Category } from './category.types'

export type CategoriesAction = ActionType<typeof Actions>
export type CategoriesState = Category[]

const DEFAULT_STATE: CategoriesState = [
  { id: 1, name: 'Cat 1' },
  { id: 2, name: 'Cat 2' }
]

export const reducer: Reducer<CategoriesState, CategoriesAction> = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case getType(Actions.addCategory): {
      return [...state, action.payload]
    }
    default:
      return state
  }
}
