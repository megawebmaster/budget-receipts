import { createAction } from 'typesafe-actions'
import { DownloadValue } from '../../connection.types'
import { BudgetEntry } from '../budget/budget-entry.types'

export const loadEntries = createAction('IRREGULAR_BUDGET/loadEntries')()
export const updateEntries = createAction('IRREGULAR_BUDGET/updateBudgetEntries')<DownloadValue<BudgetEntry>>()
