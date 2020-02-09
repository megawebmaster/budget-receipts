import { NewReceiptItem, Receipt, ReceiptItem } from '../../receipt.types'

export const createItem = (receiptId: Receipt['id'], item: NewReceiptItem): ReceiptItem => ({
  receiptId,
  id: Date.now(),
  category: {
    id: item.category,
  },
  description: item.description,
  value: item.value,
})
