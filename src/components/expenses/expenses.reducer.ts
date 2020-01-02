import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'
import {
  append,
  complement,
  filter,
  indexBy,
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
  toString,
  values,
  when,
  zipObj,
} from 'ramda'
import * as Actions from './expenses.actions'
import { ApiReceipt, Receipt, ReceiptItem } from './receipt.types'
import { AppAction } from '../../app.actions'

export type ExpensesState = {
  items: {
    [key: string]: ReceiptItem[]
  }
  loading: boolean,
  receipts: Receipt[]
}

const makeItems = (receipts: ApiReceipt[]): Record<string, ReceiptItem[]> => zipObj(
  map(pipe(prop('id'), toString), receipts),
  map(prop('items'), receipts),
)

const receiptsReducer: Reducer<ExpensesState['receipts'], AppAction> = (state = [], action) => {
  switch (action.type) {
    case getType(Actions.loadReceipts):
      return []
    case getType(Actions.updateReceipts): {
      const { receipts } = action.payload

      return values(
        mergeWith(
          mergeRight,
          indexBy(pipe(prop('id'), toString), state),
          indexBy(pipe(prop('id'), toString), receipts),
        ),
      )
    }
    case getType(Actions.addReceipt):
      return prepend(action.payload, state)
    case getType(Actions.updateReceipt): {
      const { id, date, shop } = action.payload

      return state.map(receipt => receipt.id === id ? { ...receipt, date, shop } : receipt)
    }
    case getType(Actions.deleteReceipt):
      return filter(complement(propEq('id', action.payload)), state)
    case getType(Actions.processParsedImage): {
      const { id, parsingResult } = action.payload
      const date = new Date(parsingResult.date)

      return append({
        id,
        date: date.getDate(),
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
    case getType(Actions.loadReceipts):
      return {}
    case getType(Actions.updateReceipts): {
      const { receipts } = action.payload

      return mergeDeepWith(
        (newValues: ReceiptItem[], currentValues: ReceiptItem[]) => values(
          mergeWith(
            mergeRight,
            indexBy(pipe(prop('id'), toString), currentValues),
            indexBy(pipe(prop('id'), toString), newValues),
          ),
        ),
        makeItems(receipts),
        state,
      )
    }
    case getType(Actions.processParsedImage):
    case getType(Actions.addReceipt):
      return set(lensProp(action.payload.id.toString()), [], state)
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
        map(when(propEq('id', itemId), mergeLeft(value))),
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

const loadingReducer: Reducer<ExpensesState['loading'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case getType(Actions.loadReceipts):
      return true
    case getType(Actions.updateReceipts):
      return state && action.payload.source !== 'network'
    default:
      return state
  }
}

export const reducer = combineReducers({
  receipts: receiptsReducer,
  items: itemsReducer,
  loading: loadingReducer,
})
