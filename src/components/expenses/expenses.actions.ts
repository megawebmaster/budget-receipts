import { createStandardAction } from 'typesafe-actions'
import { ApiReceipt, Receipt, ReceiptItem } from './receipt.types'
import { AppMessage } from '../message-list'

type ReceiptsLoading = {
  status: boolean
  error?: AppMessage
}
type UpdateReceipts = {
  receipts: ApiReceipt[]
  source: 'network' | 'cache'
}

export type UpdateReceipt = {
  id: number
  receipt: Receipt
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

export const clearErrors = createStandardAction('EXPENSES/clearErrors')<void>()
export const receiptsLoading = createStandardAction('EXPENSES/receiptsLoading')<ReceiptsLoading>()
export const updateReceipts = createStandardAction('EXPENSES/updateReceipts')<UpdateReceipts>()

export const addReceipt = createStandardAction('EXPENSES/addReceipt')<Receipt>()
export const updateReceipt = createStandardAction('EXPENSES/updateReceipt')<UpdateReceipt>()
export const deleteReceipt = createStandardAction('EXPENSES/deleteReceipt')<number>()

export const addReceiptItem = createStandardAction('EXPENSES/addReceiptItem')<AddReceiptItem>()
export const updateReceiptItem = createStandardAction('EXPENSES/updateReceiptItem')<UpdateReceiptItem>()
export const deleteReceiptItem = createStandardAction('EXPENSES/deleteReceiptItem')<DeleteReceiptItem>()
// export const reset = createStandardAction('EXPENSES/update').map(
//   (title: string) => ({
//     payload: {
//       title,
//       updatedAt: new Date(),
//     },
//   }),
// )
