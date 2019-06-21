import { createStandardAction } from 'typesafe-actions'
import { ApiReceipt, ParsingResult, Receipt, ReceiptItem } from './receipt.types'
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

export const clearMessages = createStandardAction('EXPENSES/clearMessages')<void>()
export const receiptsLoading = createStandardAction('EXPENSES/receiptsLoading')<void>()
export const receiptsLoadingError = createStandardAction('EXPENSES/receiptsLoadingError')<AppMessage>()
export const updateReceipts = createStandardAction('EXPENSES/updateReceipts')<UpdateReceipts>()

export const addReceipt = createStandardAction('EXPENSES/addReceipt')<Receipt>()
export const updateReceipt = createStandardAction('EXPENSES/updateReceipt')<Receipt>()
export const deleteReceipt = createStandardAction('EXPENSES/deleteReceipt')<number>()

export const addReceiptItem = createStandardAction('EXPENSES/addReceiptItem')<AddReceiptItem>()
export const updateReceiptItem = createStandardAction('EXPENSES/updateReceiptItem')<UpdateReceiptItem>()
export const deleteReceiptItem = createStandardAction('EXPENSES/deleteReceiptItem')<DeleteReceiptItem>()

export const processReceiptImage = createStandardAction('EXPENSES/processReceiptImage')<Blob>()
export const checkProcessingStatus = createStandardAction('EXPENSES/checkProcessingStatus')<string>()
export const processParsedImage = createStandardAction('EXPENSES/processParsedImage')<ParsingResult>()
export const imageParsed = createStandardAction('EXPENSES/imageParsed')<void>()
