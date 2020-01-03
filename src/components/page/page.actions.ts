import { createAction } from 'typesafe-actions'
import { Budget, BudgetYear } from './budget.types'
import { AppMessage } from '../message-list'
import { DownloadValue } from '../../connection.types'

export const pageError = createAction('PAGE/error')<AppMessage>()
export const clearPageMessages = createAction('PAGE/clearMessages')<void>()

export const loadBudgets = createAction('PAGE/loadAvailableBudgets')<void>()
export const updateBudgets = createAction('PAGE/updateBudgets')<DownloadValue<Budget>>()
export const updateBudgetYears = createAction('PAGE/updateBudgetYears')<DownloadValue<BudgetYear>>()
