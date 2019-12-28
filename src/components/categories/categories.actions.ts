import { createAction } from 'typesafe-actions'
import { Category } from './category.types'

export const addCategory = createAction('CATEGORIES/add')<Category>()
// export const updateCategory = createAction('CATEGORIES/update')<void>()
// export const deleteCategory = createAction('CATEGORIES/delete')<void>()
