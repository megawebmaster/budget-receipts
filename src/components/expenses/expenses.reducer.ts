import { Reducer } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import * as Actions from './expenses.actions'

export type ExpensesAction = ActionType<typeof Actions>
export type ExpensesState = {
  items: string[]
}

const DEFAULT_STATE = {
  items: [],
}

export const reducer: Reducer<ExpensesState, ExpensesAction> = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case getType(Actions.add):
      return { ...state, items: [...state.items, action.payload] }
    case getType(Actions.reset):
      return { ...state, items: [action.payload.title] }
    default:
      return state
  }
}
