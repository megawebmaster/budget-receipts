import { createAction } from 'typesafe-actions'
import { ApiReceipt, ImageParsingResult, Receipt, ReceiptItem } from './receipt.types'
import { AppMessage } from '../message-list'

type UpdateReceipts = {
  receipts: ApiReceipt[]
  source: 'network' | 'cache'
}

export type AddReceiptItem = {
  id: number
  value: ReceiptItem
}
export type UpdateReceiptItem = {
  id: number
  itemId: number
  value: ReceiptItem
}
export type DeleteReceiptItem = {
  id: number
  itemId: number
}
type ImageProcessingRequest = {
  id: number,
  categories: any[],
  parsingResult: ImageParsingResult
}

export const clearMessages = createAction('EXPENSES/clearMessages')<void>()
export const receiptsLoading = createAction('EXPENSES/receiptsLoading')<void>()
export const receiptsLoadingError = createAction('EXPENSES/receiptsLoadingError')<AppMessage>()
export const updateReceipts = createAction('EXPENSES/updateReceipts')<UpdateReceipts>()

export const addReceipt = createAction('EXPENSES/addReceipt')<Receipt>()
export const updateReceipt = createAction('EXPENSES/updateReceipt')<Receipt>()
export const deleteReceipt = createAction('EXPENSES/deleteReceipt')<number>()

export const addReceiptItem = createAction('EXPENSES/addReceiptItem')<AddReceiptItem>()
export const updateReceiptItem = createAction('EXPENSES/updateReceiptItem')<UpdateReceiptItem>()
export const deleteReceiptItem = createAction('EXPENSES/deleteReceiptItem')<DeleteReceiptItem>()

export const processReceiptImage = createAction('EXPENSES/processReceiptImage')<Blob>()
export const checkProcessingStatus = createAction('EXPENSES/checkProcessingStatus')<string>()
export const processParsedImage = createAction('EXPENSES/processParsedImage')<ImageProcessingRequest>()
export const imageParsed = createAction('EXPENSES/imageParsed')<number>()
