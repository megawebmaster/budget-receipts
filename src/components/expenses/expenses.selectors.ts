import { flatten, mapObjIndexed, prop, propEq, sum, values } from 'ramda'
import { createSelector } from 'reselect'

import { AppState } from '../../app.store'
import { ReceiptItem } from './receipt.types'
import { Filter, ItemFilter } from './expenses.actions'

const allReceipts = (state: AppState) => state.expenses.receipts
const allReceiptItems = (state: AppState): { [key: string]: ReceiptItem[] } => state.expenses.items
const appliedFilters = (state: AppState) => state.expenses.filters
const appliedItemFilters = (state: AppState) => state.expenses.itemFilters

export const expensesLoading = (state: AppState) => state.expenses.loading

const checkFilters = <T extends string>(filters: Record<T, string | number | (string | number)[]>, item: Record<T, string | number>) =>
  values(
    mapObjIndexed(
      (value, field) => {
        if (Array.isArray(value)) {
          return value.length === 0 || value.includes(item[field] || '')
        }

        return !value || value === item[field]
      },
      filters
    )
  ).every(Boolean)

export const expensesReceipts = createSelector(
  [allReceipts, allReceiptItems, appliedFilters, appliedItemFilters],
  (receipts, receiptItems, filters, itemFilters) => receipts.filter(
    (receipt) => checkFilters(filters, receipt) && receiptItems[receipt.id]?.some(item => checkFilters(itemFilters, item))
  )
)

export const expensesReceiptItems = (state: AppState): { [key: string]: ReceiptItem[] } => state.expenses.items

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

export const allExpensesExpandedSelector = createSelector(
  [expensesReceipts],
  items => items.every(item => item.expanded),
)

export const createFilterSelector = (field: Filter['field']) => createSelector(
  [appliedFilters],
  (filters) => filters[field]
)

export const createItemFilterSelector = (field: ItemFilter['field']) => createSelector(
  [appliedItemFilters],
  (itemFilters) => itemFilters[field]
)
