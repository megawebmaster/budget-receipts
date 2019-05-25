import { createStandardAction } from 'typesafe-actions'
import { ApiReceipt, ReceiptItem } from './receipt.types'
import { AppMessage } from '../message-list'

export type AddReceiptItem = {
  id: number,
  value: ReceiptItem
}
export type UpdateReceiptItem = {
  id: number,
  itemId: number,
  value: ReceiptItem
}
export type DeleteReceiptItem = {
  id: number,
  itemId: number,
}
type UpdateReceipts = {
  receipts: ApiReceipt[],
  source: 'network' | 'cache'
}
type ReceiptsLoading = {
  status: boolean,
  error?: AppMessage
}

export const clearErrors = createStandardAction('EXPENSES/clearErrors')<void>()
export const receiptsLoading = createStandardAction('EXPENSES/receiptsLoading')<ReceiptsLoading>()
export const updateReceipts = createStandardAction('EXPENSES/updateReceipts')<UpdateReceipts>()
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
