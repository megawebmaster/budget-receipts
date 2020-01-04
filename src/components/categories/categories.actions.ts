import { createAction } from 'typesafe-actions'
import { Category } from './category.types'
import { CreateValue, DownloadValue } from '../../connection.types'

export type CreateCategory = {
  id: CreateValue<Category>['currentId']
  parentId?: Category['id']
  type: Category['type']
  value: string
}

export type UpdateCategory = {
  id: Category['id']
  type?: Category['type']
  name?: Category['name']
  parent?: Category['parent']
}

export type DeleteCategory = {
  id: Category['id']
  type: Category['type']
}

export const updateCategories = createAction('CATEGORIES/updateAll')<DownloadValue<Category>>()
export const createCategory = createAction('CATEGORIES/createCategory')<CreateCategory>()
export const categoryCreated = createAction('CATEGORIES/categoryCreated')<CreateValue<Category>>()
export const updateCategory = createAction('CATEGORIES/updateCategory')<UpdateCategory>()
export const deleteCategory = createAction('CATEGORIES/deleteCategory')<DeleteCategory>()
