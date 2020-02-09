// TODO: Check if this can be simplified using real fields from Receipt type
export type FocusableExpenseFields = 'day' | 'category'
export type ReceiptFields = 'day' | 'shop'
export type ReceiptItemFields = 'category' | 'value' | 'description'
export type ExpenseFields = ReceiptFields | ReceiptItemFields
