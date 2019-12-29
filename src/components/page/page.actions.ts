import { createAction } from 'typesafe-actions'
import { Budget } from './budget.types'
import { AppMessage } from '../message-list'

type UpdateBudgets = {
  budgets: Budget[]
  source: 'network' | 'cache'
}

export const pageError = createAction('PAGE/Error')<AppMessage>()
export const clearPageMessages = createAction('PAGE/clearMessages')<void>()

export const loadBudgets = createAction('PAGE/LoadAvailableBudgets')<void>()
export const updateBudgets = createAction('PAGE/UpdateBudgets')<UpdateBudgets>()
