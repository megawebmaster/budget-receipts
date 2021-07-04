export type ReceiptItem = {
  id: number
  categoryId: number
  value: number
  description?: string
  receiptId: number
  webCrypto?: boolean
}

export type NewReceiptItem = {
  categoryId: number
  value: number
  description?: string
}

export type ChangeReceiptItem = {
  categoryId?: ReceiptItem['categoryId']
  value?: ReceiptItem['value']
  description?: ReceiptItem['description']
}

export type Receipt = {
  id: number
  day: number
  shop: string
  expanded?: boolean
  processing?: boolean
  webCrypto?: boolean
}

export type ReceiptUpdateFields = {
  day?: Receipt['day']
  shop?: Receipt['shop']
  item?: NewReceiptItem
}

export type ApiReceipt = {
  id: number
  day: number
  shop: string
  items: ReceiptItem[]
}

type ParsedItem = {
  description: string
  total: number
  supplementaryLineItems?: {
    above: ParsedItem[]
    below: ParsedItem[]
  }
}

export type ImageParsingResult = {
  establishment: string
  date: string
  total: number
  lineItems: ParsedItem[]
}

export type ProcessRequestMessage = {
  id: number
  categories: any[]
  items: ParsedItem[]
}

export type ProcessingMessage = ProcessingItemMessage | ProcessingDoneMessage
type ProcessingDoneMessage = {
  type: 'done'
  id: number
}
type ProcessingItemMessage = {
  type: 'item'
  id: number
  value: Omit<ReceiptItem, 'id'>
}
