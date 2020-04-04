import { createAction } from 'typesafe-actions'

export const requirePassword = createAction('PASSWORD/require')<void>()
