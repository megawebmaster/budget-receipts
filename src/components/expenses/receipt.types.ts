export type ReceiptItem = {
  id: number
  category: number
  price: number
  description?: string
}

export type NewReceiptItem = {
  id: number
  category?: number
  price?: number
  description?: string
}

export type Receipt = {
  id: number
  date: number
  shop?: string
  expanded?: boolean
  processing?: boolean
}

export type ApiReceipt = {
  id: number
  date: number
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
