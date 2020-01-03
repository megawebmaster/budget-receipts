import { createAction } from 'typesafe-actions'
import { Category, CategoryType } from './category.types'

type UpdateCategories = {
  categories: Category[]
  source: 'network' | 'cache'
}
export type CreateCategory = {
  parentId?: number
  type: CategoryType
  value: string
}

export const updateCategories = createAction('CATEGORIES/updateAll')<UpdateCategories>()
export const createCategory = createAction('CATEGORIES/createCategory')<CreateCategory>()
