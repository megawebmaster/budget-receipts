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

export type ParsingResultItem = {
  description: string
  total: number
  supplementaryLineItems?: {
    above: ParsingResultItem[]
    below: ParsingResultItem[]
  }
}

export type ParsingResult = {
  establishment: string
  date: string
  total: number
  lineItems: ParsingResultItem[]
}
