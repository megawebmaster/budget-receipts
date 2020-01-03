import { createAction } from 'typesafe-actions'
import { BudgetEntry, BudgetEntryValueType } from './budget-entry.types'
import { DownloadValue } from '../../connection.types'

type UpdateBudgetEntry = {
  categoryId: number
  type: BudgetEntryValueType
  value: number
}

export const updateEntries = createAction('BUDGET/updateBudgetEntries')<DownloadValue<BudgetEntry>>()
export const updateEntry = createAction('BUDGET/updateBudgetEntry')<UpdateBudgetEntry>()
