import { ActionType, createAction } from 'typesafe-actions'
import * as EncryptionActions from '../../encryption/encryption.actions'

export type AfterAction = ActionType<typeof EncryptionActions>

export const requirePassword = createAction('PASSWORD/require')<AfterAction>()
export const continueActions = createAction('PASSWORD/continueActions')<void>()
