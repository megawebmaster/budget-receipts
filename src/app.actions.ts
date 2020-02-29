import { ActionType } from 'typesafe-actions'

import { RouteAction } from './routes'
import * as EncryptionActions from './encryption/encryption.actions'
import * as PasswordRequirementActions from './components/password-requirement/password-requirement.actions'
import * as AuthActions from './auth/auth.actions'
import { ApiAction } from './api.actions'
import { NoopAction } from './system.actions'

export type AppAction =
  RouteAction |
  ApiAction |
  ActionType<typeof EncryptionActions> |
  ActionType<typeof PasswordRequirementActions> |
  ActionType<typeof AuthActions> |
  NoopAction
