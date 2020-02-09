import { NewReceiptItem, Receipt, ReceiptItem } from '../../receipt.types'

export const createItem = (receiptId: Receipt['id'], item: NewReceiptItem): ReceiptItem => ({
  receiptId,
  id: Date.now(),
  categoryId: item.categoryId,
  description: item.description,
  value: item.value,
})
