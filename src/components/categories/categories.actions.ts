import { createAction } from 'typesafe-actions'
import { Category, CategoryType } from './category.types'
import { DownloadValue } from '../../connection.types'

export type CreateCategory = {
  parentId?: number
  type: CategoryType
  value: string
}

export const updateCategories = createAction('CATEGORIES/updateAll')<DownloadValue<Category>>()
export const createCategory = createAction('CATEGORIES/createCategory')<CreateCategory>()
