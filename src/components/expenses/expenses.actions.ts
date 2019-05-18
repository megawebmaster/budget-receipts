import { createStandardAction } from 'typesafe-actions'
import { Receipt, ReceiptItem } from './receipt'
import { AppMessage } from '../message-list'

type AddReceiptItem = {
  id: number,
  value: ReceiptItem
}
type UpdateReceiptItem = {
  id: number,
  itemId: number,
  value: ReceiptItem
}
type DeleteReceiptItem = {
  id: number,
  itemId: number,
}
type UpdateReceipts = {
  receipts: Receipt[],
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
