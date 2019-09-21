import { createStandardAction } from 'typesafe-actions'
import { Category } from './category.types'

export const addCategory = createStandardAction('CATEGORIES/add')<Category>()
// export const updateCategory = createStandardAction('CATEGORIES/update')<void>()
// export const deleteCategory = createStandardAction('CATEGORIES/delete')<void>()
