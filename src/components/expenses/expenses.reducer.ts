import { Reducer } from "redux"
import { ActionType, getType } from "typesafe-actions"
import * as Actions from "./expenses.actions"
import { Receipt } from "./receipt"

export type ExpensesAction = ActionType<typeof Actions>
export type ExpensesState = {
  receipts: Receipt[]
}

const DEFAULT_STATE = {
  receipts: [
    {
      id: 1,
      date: 20,
      shop: "Lidl",
      items: [
        { id: 1, category: "c2", price: 200, description: "Test 1" },
        { id: 2, category: "c1", price: 100, description: "Test 2" },
      ],
    },
    {
      id: 2,
      date: 21,
      shop: "Biedronka",
      items: [
        { id: 3, category: "c1", price: 100.23, description: "Test 3" },
      ],
    },
  ],
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
      }
    }
    default:
      return state
  }
}
