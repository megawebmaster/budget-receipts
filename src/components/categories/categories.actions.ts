import { createAction } from 'typesafe-actions'
import { Category } from './category.types'

type UpdateCategories = {
  categories: Category[]
  source: 'network' | 'cache'
}

export const updateCategories = createAction('CATEGORIES/updateAll')<UpdateCategories>()

export const addCategory = createAction('CATEGORIES/add')<Category>()
// export const updateCategory = createAction('CATEGORIES/update')<void>()
// export const deleteCategory = createAction('CATEGORIES/delete')<void>()
