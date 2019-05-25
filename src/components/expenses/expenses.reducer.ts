import { Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { AppMessage } from '../message-list'
import * as Actions from './expenses.actions'
import { Receipt, ReceiptItem } from './receipt.types'

export type ExpensesAction = ActionType<typeof Actions>
export type ExpensesState = {
  receipts: Receipt[],
  items: {
    [key: string]: ReceiptItem[]
  }
  loading: boolean,
  errors: AppMessage[],
}

const DEFAULT_STATE: ExpensesState = {
  receipts: [],
  items: {},
  loading: false,
  errors: [],
}

export const reducer: Reducer<ExpensesState, ExpensesAction> = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
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
    case getType(Actions.updateReceipts): {
      // TODO: Improve this reducer with ramda
      const existingReceipts = state.receipts.map(receipt => receipt.id)
      const newReceipts = action.payload.receipts.filter(receipt => !existingReceipts.includes(receipt.id))
      const newItems: Record<number, ReceiptItem[]> = {}
      newReceipts.forEach(receipt => newItems[receipt.id] = receipt.items)

      return {
        ...state,
        receipts: [...state.receipts, ...newReceipts].sort((a, b) => a.id! - b.id!),
        items: {
          ...state.items,
          ...newItems,
        },
        loading: action.payload.source !== 'network',
      }
    }
    case getType(Actions.receiptsLoading): {
      const { status, error } = action.payload

      return {
        ...state,
        loading: status,
        errors: error ? [...state.errors, error] : state.errors,
      }
    }
    case getType(Actions.clearErrors): {
      return {
        ...state,
        errors: state.errors.filter(error => error.sticky),
      }
    }
    default:
      return state
  }
}
