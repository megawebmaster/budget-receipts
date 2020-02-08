export type ReceiptItem = {
  id: number
  category: {
    id?: number
  }
  value: number
  description?: string
  receiptId: number
}

export type NewReceiptItem = Omit<ReceiptItem, 'id' | 'receiptId'>

export type Receipt = {
  id: number
  day: number
  shop?: string
  expanded?: boolean
  processing?: boolean
}

export type ReceiptUpdateFields = Pick<Receipt, 'day' | 'shop'>

export type ApiReceipt = {
  id: number
  day: number
  shop?: string
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
