import { createAction } from 'typesafe-actions'
import { ApiReceipt, ChangeReceiptItem, ImageParsingResult, Receipt, ReceiptItem } from './receipt.types'
import { DownloadValue, SaveValue } from '../../connection.types'

export type BudgetValues = {
  budgetValues: { categoryId: number, value: number }[]
}

export type AddReceipt = {
  receipt: Receipt,
  items: ReceiptItem[]
}

type ReceiptCreated = ApiReceipt & BudgetValues
export type ExpenseDeleted = { id: number } & BudgetValues

export type UpdateReceipt = {
  id: Receipt['id'],
  day?: Receipt['day']
  shop?: Receipt['shop']
}

export type AddReceiptItem = {
  id: number
  value: ReceiptItem
}

export type ReceiptItemCreated = ReceiptItem & BudgetValues

export type UpdateReceiptItem = {
  id: number
  itemId: number
  value: ChangeReceiptItem
}

export type DeleteReceiptItem = {
  id: number
  itemId: number
}

export type Filter = {
  field: 'day' | 'shop'
  value: string | number
}

export type ItemFilter = {
  field: 'categoryId'
  value: (string | number)[]
}

type ImageProcessingRequest = {
  id: number,
  categories: any[],
  parsingResult: ImageParsingResult
}

export const loadReceipts = createAction('EXPENSES/loadReceipts')()
export const loadReceiptsFromApi = createAction('EXPENSES/loadReceiptsFromApi')<DownloadValue<ApiReceipt>>()

export const updateReceipts = createAction('EXPENSES/updateReceipts')<DownloadValue<ApiReceipt>>()
export const updateReceiptItems = createAction('EXPENSES/updateReceiptsItems')<DownloadValue<ReceiptItem>>()

export const addReceipt = createAction('EXPENSES/addReceipt')<AddReceipt>()
export const receiptCreated = createAction('EXPENSES/receiptCreated')<SaveValue<ReceiptCreated>>()
export const updateReceipt = createAction('EXPENSES/updateReceipt')<UpdateReceipt>()
export const receiptUpdated = createAction('EXPENSES/receiptUpdated')<SaveValue<ApiReceipt>>()
export const deleteReceipt = createAction('EXPENSES/deleteReceipt')<number>()

export const addReceiptItem = createAction('EXPENSES/addReceiptItem')<AddReceiptItem>()
export const receiptItemCreated = createAction('EXPENSES/receiptItemCreated')<SaveValue<ReceiptItemCreated>>()
export const updateReceiptItem = createAction('EXPENSES/updateReceiptItem')<UpdateReceiptItem>()
export const receiptItemUpdated = createAction('EXPENSES/receiptItemUpdated')<SaveValue<ReceiptItemCreated>>()
export const deleteReceiptItem = createAction('EXPENSES/deleteReceiptItem')<DeleteReceiptItem>()
export const expandAllReceipts = createAction('EXPENSES/expandAllReceipts')()
export const contractAllReceipts = createAction('EXPENSES/contractAllReceipts')()

export const setFilter = createAction('EXPENSES/setFilter')<Filter>()
export const setItemFilter = createAction('EXPENSES/setItemFilter')<ItemFilter>()
export const resetFilters = createAction('EXPENSES/resetFilters')()

export const processReceiptImage = createAction('EXPENSES/processReceiptImage')<Blob>()
export const checkProcessingStatus = createAction('EXPENSES/checkProcessingStatus')<string>()
export const processParsedImage = createAction('EXPENSES/processParsedImage')<ImageProcessingRequest>()
export const imageParsed = createAction('EXPENSES/imageParsed')<number>()
