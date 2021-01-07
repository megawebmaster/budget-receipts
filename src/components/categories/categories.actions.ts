import { createAction } from 'typesafe-actions'
import { Category } from './category.types'
import { SaveValue, DownloadValue } from '../../connection.types'

export type CreateCategory = {
  id: Category['id']
  name: Category['name']
  parentId?: Category['id']
  type: Category['type']
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

export const loadCategories = createAction('CATEGORIES/loadCategories')()
export const decryptedCategories = createAction('CATEGORIES/decrypted')<DownloadValue<Category>>()
export const updateCategories = createAction('CATEGORIES/updateAll')<DownloadValue<Category>>()
export const addCategory = createAction('CATEGORIES/addCategory')<CreateCategory>()
export const createCategory = createAction('CATEGORIES/createCategory')<Category>()
export const categoryCreated = createAction('CATEGORIES/categoryCreated')<SaveValue<Category>>()
export const updateCategory = createAction('CATEGORIES/updateCategory')<UpdateCategory>()
export const categoryUpdated = createAction('CATEGORIES/categoryUpdated')<SaveValue<Category>>()
export const deleteCategory = createAction('CATEGORIES/deleteCategory')<DeleteCategory>()
