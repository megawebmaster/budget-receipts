import { AppState } from '../../app.store'
import { flatten, prop, propEq, sum, values } from 'ramda'
import { createSelector } from 'reselect'

export const expensesReceipts = (state: AppState) => state.expenses.receipts
export const expensesReceiptItems = (state: AppState) => state.expenses.items
export const expensesLoading = (state: AppState) => state.expenses.loading

export const createReceiptSelector = (id: number) =>
  createSelector(
    [expensesReceipts],
    receipts => receipts.find(propEq('id', id)),
  )

export const createReceiptItemsSelector = (id: number) =>
  createSelector(
    [expensesReceiptItems],
    items => items[id] || [],
  )

export const createReceiptItemSelector = (receiptId: number, itemId: number) =>
  createSelector(
    [createReceiptItemsSelector(receiptId)],
    items => items.find(propEq('id', itemId)),
  )

export const expensesAllItems = createSelector(
  [expensesReceiptItems],
  items => flatten(values(items)),
)

const createCategoryItemsSelector = (categoryId: number) => createSelector(
  [expensesAllItems],
  items => items.filter(propEq('categoryId', categoryId)),
)

export const createCategorySpentSelector = (categoryId: number) =>
  createSelector(
    [createCategoryItemsSelector(categoryId)],
    items => sum(items.map(prop('value'))),
  )
