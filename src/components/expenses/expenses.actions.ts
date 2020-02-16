import { createAction } from 'typesafe-actions'
import { ApiReceipt, ChangeReceiptItem, ImageParsingResult, Receipt, ReceiptItem } from './receipt.types'
import { DownloadValue, SaveValue } from '../../connection.types'

export type AddReceipt = {
  receipt: Receipt,
  items: ReceiptItem[]
}
export type AddReceiptItem = {
  id: number
  value: ReceiptItem
}
export type UpdateReceiptItem = {
  id: number
  itemId: number
  value: ChangeReceiptItem
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

export const loadReceiptsFromApi = createAction('EXPENSES/loadReceiptsFromApi')<DownloadValue<ApiReceipt>>()

export const updateReceipts = createAction('EXPENSES/updateReceipts')<DownloadValue<ApiReceipt>>()
export const updateReceiptItems = createAction('EXPENSES/updateReceiptsItems')<DownloadValue<ReceiptItem>>()

export const addReceipt = createAction('EXPENSES/addReceipt')<AddReceipt>()
export const receiptCreated = createAction('EXPENSES/receiptCreated')<SaveValue<ApiReceipt>>()
export const updateReceipt = createAction('EXPENSES/updateReceipt')<Receipt>()
export const deleteReceipt = createAction('EXPENSES/deleteReceipt')<number>()

export const addReceiptItem = createAction('EXPENSES/addReceiptItem')<AddReceiptItem>()
export const receiptItemCreated = createAction('EXPENSES/receiptCreated')<SaveValue<ReceiptItem>>()
export const updateReceiptItem = createAction('EXPENSES/updateReceiptItem')<UpdateReceiptItem>()
export const deleteReceiptItem = createAction('EXPENSES/deleteReceiptItem')<DeleteReceiptItem>()

export const processReceiptImage = createAction('EXPENSES/processReceiptImage')<Blob>()
export const checkProcessingStatus = createAction('EXPENSES/checkProcessingStatus')<string>()
export const processParsedImage = createAction('EXPENSES/processParsedImage')<ImageProcessingRequest>()
export const imageParsed = createAction('EXPENSES/imageParsed')<number>()
