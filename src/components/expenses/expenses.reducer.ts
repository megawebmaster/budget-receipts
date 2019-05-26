import { Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { AppMessage } from '../message-list'
import * as Actions from './expenses.actions'
import { ApiReceipt, Receipt, ReceiptItem } from './receipt.types'
import { complement, filter, includes, map, omit, pipe, prop, zipObj, toString } from 'ramda'

export type ExpensesAction = ActionType<typeof Actions>
export type ExpensesState = {
  receipts: Receipt[],
  items: {
    [key: string]: ReceiptItem[]
  }
  loading: boolean,
  messages: AppMessage[],
}

const DEFAULT_STATE: ExpensesState = {
  receipts: [],
  items: {},
  loading: false,
  messages: [],
}

const makeItems = (receipts: ApiReceipt[]): Record<string, ReceiptItem[]> => zipObj(
  map(pipe(prop('id'), toString), receipts),
  map(prop('items'), receipts),
)

const notIncludes: <S, T extends { id: S }> (list: S[]) => (value: T) => boolean =
  (list) => (value) => complement(includes(prop('id', value)))(list)

export const reducer: Reducer<ExpensesState, ExpensesAction> = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case getType(Actions.receiptsLoading): {
      return {
        ...state,
        receipts: [],
        items: {},
        loading: true
      }
    }
    case getType(Actions.receiptsLoadingError): {
      return {
        ...state,
        loading: false,
        messages: [...state.messages, action.payload]
      }
    }
    case getType(Actions.clearMessages): {
      return {
        ...state,
        messages: state.messages.filter(message => message.sticky),
      }
    }
    case getType(Actions.updateReceipts): {
      const { receipts } = action.payload
      const existingReceipts = map(prop('id'), state.receipts)
      const newReceipts = filter(notIncludes(existingReceipts), receipts)
      const newItems = makeItems(newReceipts)

      // TODO: Update existing items with new elements too!
      return {
        ...state,
        receipts: [...state.receipts, ...newReceipts].sort((a, b) => a.id - b.id),
        items: {
          ...state.items,
          ...newItems,
        },
        loading: state.loading && action.payload.source !== 'network',
      }
    }
    case getType(Actions.addReceipt): {
      return {
        ...state,
        receipts: [...state.receipts, action.payload],
        items: {
          ...state.items,
          [action.payload.id]: [],
        },
      }
    }
    case getType(Actions.updateReceipt): {
      const { id, date, shop } = action.payload

      return {
        ...state,
        receipts: state.receipts.map(receipt => receipt.id === id ? { ...receipt, date, shop } : receipt),
      }
    }
    case getType(Actions.deleteReceipt): {
      return {
        ...state,
        receipts: state.receipts.filter(receipt => receipt.id !== action.payload),
        items: omit([action.payload.toString()], state.items),
      }
    }
    case getType(Actions.addReceiptItem): {
      const { id, value } = action.payload

      return {
        ...state,
        items: {
          ...state.items,
          [id]: [...state.items[id], value],
        },
      }
    }
    case getType(Actions.updateReceiptItem): {
      const { id, itemId, value } = action.payload

      return {
        ...state,
        items: {
          ...state.items,
          [id]: state.items[id].map(item => item.id !== itemId ? item : { ...item, ...value }),
        },
      }
    }
    case getType(Actions.deleteReceiptItem): {
      const { id, itemId } = action.payload

      return {
        ...state,
        items: {
          ...state.items,
          [id]: state.items[id].filter(item => item.id !== itemId),
        },
      }
    }
    default:
      return state
  }
}
