export type ReceiptItem = {
  id: number
  category: string
  price: number
  description?: string
}

export type Receipt = {
  id: number
  date: number
  shop?: string
  expanded?: boolean
}

export type ApiReceipt = {
  id: number
  date: number
  shop?: string
  items: ReceiptItem[]
}
