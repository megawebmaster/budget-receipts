import { createStandardAction } from 'typesafe-actions'
import { AppMessage } from '../message-list'

export const clearMessages = createStandardAction('EXPENSES/clearMessages')<void>()
export const receiptsLoading = createStandardAction('EXPENSES/receiptsLoading')<void>()
export const receiptsLoadingError = createStandardAction('EXPENSES/receiptsLoadingError')<AppMessage>()
