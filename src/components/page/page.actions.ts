import { createAction } from 'typesafe-actions'
import { Budget } from './budget.types'
import { AppMessage } from '../message-list'

type UpdateBudgets = {
  budgets: Budget[]
  source: 'network' | 'cache'
}

export const pageError = createAction('PAGE/error')<AppMessage>()
export const clearPageMessages = createAction('PAGE/clearMessages')<void>()

export const loadBudgets = createAction('PAGE/loadAvailableBudgets')<void>()
export const updateBudgets = createAction('PAGE/updateBudgets')<UpdateBudgets>()
