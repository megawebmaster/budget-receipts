import { createAction } from 'typesafe-actions'
import { AppMessage } from '../message-list'

export const clearMessages = createAction('EXPENSES/clearMessages')<void>()
export const receiptsLoading = createAction('EXPENSES/receiptsLoading')<void>()
export const receiptsLoadingError = createAction('EXPENSES/receiptsLoadingError')<AppMessage>()
