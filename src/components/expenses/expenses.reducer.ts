import { Reducer } from "redux"
import { ActionType, getType } from "typesafe-actions"
import { AppMessage } from '../message-list'
import * as Actions from "./expenses.actions"
import { Receipt } from "./receipt"

export type ExpensesAction = ActionType<typeof Actions>
export type ExpensesState = {
  receipts: Receipt[],
  loading: boolean,
  errors: AppMessage[],
}

const DEFAULT_STATE: ExpensesState = {
  receipts: [],
  loading: false,
  errors: []
}

export const reducer: Reducer<ExpensesState, ExpensesAction> = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case getType(Actions.addReceiptItem): {
      const { id, value } = action.payload
      return {
        ...state,
        receipts: state.receipts.map(receipt => (
          receipt.id !== id ? receipt : { ...receipt, items: [...receipt.items, value] }
        )),
      }
    }
    case getType(Actions.updateReceiptItem): {
      const { id, itemId, value } = action.payload
      return {
        ...state,
        receipts: state.receipts.map(receipt => (
          receipt.id !== id
            ? receipt
            : {
              ...receipt,
              items: receipt.items.map(item => item.id !== itemId ? item : { ...item, ...value }),
            }
        )),
      }
    }
    case getType(Actions.deleteReceiptItem): {
      const { id, itemId } = action.payload
      return {
        ...state,
        receipts: state.receipts.map(receipt => (
          receipt.id !== id ? receipt : { ...receipt, items: receipt.items.filter(item => item.id !== itemId) }
        )),
        loading: false,
      }
    }
    case getType(Actions.updateReceipts): {
      const existingReceipts = state.receipts.map(receipt => receipt.id)
      const newReceipts = action.payload.receipts.filter(receipt => !existingReceipts.includes(receipt.id))

      return {
        ...state,
        receipts: [...newReceipts, ...state.receipts].sort((a, b) => a.id! - b.id!),
        loading: action.payload.source !== 'network'
      }
    }
    case getType(Actions.receiptsLoading): {
      const { status, error } = action.payload

      return {
        ...state,
        loading: status,
        errors: error ? [...state.errors, error] : state.errors
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
