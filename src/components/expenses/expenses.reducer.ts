import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'
import {
  append,
  complement,
  descend,
  filter,
  findIndex,
  indexBy,
  lensPath,
  lensProp,
  map,
  mergeDeepWith,
  mergeLeft,
  mergeRight,
  mergeWith,
  omit,
  over,
  pipe,
  prepend,
  prop,
  propEq,
  set,
  sort,
  toString,
  values,
  when,
} from 'ramda'

import * as Actions from './expenses.actions'
import { Filter, ItemFilter } from './expenses.actions'
import { Receipt, ReceiptItem } from './receipt.types'
import { AppAction } from '../../app.actions'
import { AvailableRoutes } from '../../routes'

export type ExpensesState = {
  items: {
    [key: string]: ReceiptItem[]
  }
  filters: Record<Filter['field'], string | number>
  itemFilters: Record<ItemFilter['field'], (string | number)[]>
  loading: boolean,
  receipts: Receipt[]
}

const receiptsReducer: Reducer<ExpensesState['receipts'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case AvailableRoutes.EXPENSES_MONTH:
      return []
    case getType(Actions.updateReceipts): {
      return sort(descend(prop('id')), action.payload.value)
    }
    case getType(Actions.addReceipt):
      return prepend(action.payload.receipt, state)
    case getType(Actions.receiptCreated): {
      const { currentId, value } = action.payload

      return set(
        lensPath([
          findIndex(propEq('id', currentId), state),
          'id',
        ]),
        value.id,
        state,
      )
    }
    case getType(Actions.updateReceipt): {
      const { id, ...values } = action.payload

      return state.map(receipt => receipt.id === id ? { ...receipt, ...values } : receipt)
    }
    case getType(Actions.deleteReceipt):
      return filter(complement(propEq('id', action.payload)), state)
    case getType(Actions.contractAllReceipts):
      return map(item => ({ ...item, expanded: false }), state)
    case getType(Actions.expandAllReceipts):
      return map(item => ({ ...item, expanded: true }), state)
    case getType(Actions.processParsedImage): {
      const { id, parsingResult } = action.payload
      const date = new Date(parsingResult.date)

      return append({
        id,
        day: date.getDate(),
        shop: parsingResult.establishment,
        expanded: true,
        processing: true,
      }, state)
    }
    case getType(Actions.imageParsed): {
      const id = action.payload

      return state.map(receipt => receipt.id === id ? { ...receipt, processing: false } : receipt)
    }
    default:
      return state
  }
}

const itemsReducer: Reducer<ExpensesState['items'], AppAction> = (state = {}, action) => {
  switch (action.type) {
    case AvailableRoutes.EXPENSES_MONTH:
      return {}
    case getType(Actions.updateReceiptItems): {
      if (action.payload.value.length === 0) {
        return state
      }
      // TODO: Make it more beautiful
      // TODO: Fix updating with network values - they are always better
      return mergeDeepWith(
        (newValues: ReceiptItem[], currentValues: ReceiptItem[]) => sort(descend(prop('id')), values(
          mergeWith(
            mergeRight,
            indexBy(pipe(prop('id'), toString), currentValues),
            indexBy(pipe(prop('id'), toString), newValues),
          ),
        )),
        { [action.payload.value[0].receiptId]: action.payload.value },
        state,
      )
    }
    case getType(Actions.processParsedImage):
      return set(lensProp(action.payload.id.toString()), [], state)
    case getType(Actions.addReceipt):
      return set(lensProp(action.payload.receipt.id.toString()), action.payload.items, state)
    case getType(Actions.receiptCreated): {
      const { currentId, value } = action.payload

      if (!currentId) {
        return state
      }

      return {
        ...omit([currentId.toString()], state),
        [value.id]: value.items,
      }
    }
    case getType(Actions.receiptItemCreated): {
      const { currentId, value } = action.payload
      const receiptId = (value as ReceiptItem).receiptId

      return set(
        lensPath([
          receiptId,
          findIndex(propEq('id', currentId), state[receiptId]),
          'id',
        ]),
        value.id,
        state,
      )
    }
    case getType(Actions.deleteReceipt): {
      return omit([action.payload.toString()], state)
    }
    case getType(Actions.addReceiptItem): {
      const { id, value } = action.payload

      return over(lensProp(id.toString()), prepend(value), state)
    }
    case getType(Actions.updateReceiptItem): {
      const { id, itemId, value } = action.payload

      return over(
        lensProp(id.toString()),
        map(when<ReceiptItem, ReceiptItem>(propEq('id', itemId), mergeLeft(value))),
        state,
      )
    }
    case getType(Actions.deleteReceiptItem): {
      const { id, itemId } = action.payload

      return over(lensProp(id.toString()), filter(complement(propEq('id', itemId))), state)
    }
    default:
      return state
  }
}

const loadingReducer: Reducer<ExpensesState['loading'], AppAction> = (state = true, action) => {
  switch (action.type) {
    case AvailableRoutes.EXPENSES_MONTH:
      return true
    case getType(Actions.updateReceipts):
      return state && action.payload.source !== 'network'
    default:
      return state
  }
}

const EMPTY_FILTERS = { day: '', shop: '' }
const filtersReducer: Reducer<ExpensesState['filters'], AppAction> = (state = EMPTY_FILTERS, action) => {
  switch (action.type) {
    case getType(Actions.setFilter):
      return set(
        lensProp(action.payload.field),
        action.payload.value,
        state,
      )
    case getType(Actions.resetFilters):
      return EMPTY_FILTERS
    default:
      return state
  }
}

const EMPTY_ITEM_FILTERS = { categoryId: [] }
const itemFiltersReducer: Reducer<ExpensesState['itemFilters'], AppAction> = (state = EMPTY_ITEM_FILTERS, action) => {
  switch (action.type) {
    case getType(Actions.setItemFilter):
      return set(
        lensProp(action.payload.field),
        action.payload.value,
        state,
      )
    case getType(Actions.resetFilters):
      return EMPTY_ITEM_FILTERS
    default:
      return state
  }
}

export const reducer = combineReducers({
  receipts: receiptsReducer,
  items: itemsReducer,
  filters: filtersReducer,
  itemFilters: itemFiltersReducer,
  loading: loadingReducer,
})
