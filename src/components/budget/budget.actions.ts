import { createAction } from 'typesafe-actions'
import { BudgetEntry, BudgetEntryValueType } from './budget-entry.types'

type UpdateBudgetEntries = {
  entries: BudgetEntry[]
  source: 'network' | 'cache'
}

type UpdateBudgetEntry = {
  categoryId: number
  type: BudgetEntryValueType
  value: number
}

export const updateEntries = createAction('BUDGET/updateBudgetEntries')<UpdateBudgetEntries>()
export const updateEntry = createAction('BUDGET/updateBudgetEntry')<UpdateBudgetEntry>()
