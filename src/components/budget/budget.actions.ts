import { createAction } from 'typesafe-actions'
import { BudgetEntry } from './budget-entry.types'

type UpdateBudgetEntries = {
  entries: BudgetEntry[]
  source: 'network' | 'cache'
}

export const loadEntries = createAction('BUDGET/LoadBudgetEntries')<void>()
export const updateEntries = createAction('BUDGET/UpdateBudgetEntries')<UpdateBudgetEntries>()
