import { RouteAction } from './routes'
import * as BudgetActions from './components/budget/budget.actions'
import * as CategoriesActions from './components/categories/categories.actions'
import * as EncryptionActions from './encryption/encryption.actions'
import * as ExpensesActions from './components/expenses/expenses.actions'
import * as PageActions from './components/page/page.actions'
import * as PasswordRequirementActions from './components/password-requirement/password-requirement.actions'
import { ActionType } from 'typesafe-actions'

type NoopAction = {
  type: 'noop',
  payload: object
}

export const noop = (): NoopAction => ({
  type: 'noop',
  payload: {},
})

export type AppAction =
  RouteAction |
  ActionType<typeof BudgetActions> |
  ActionType<typeof CategoriesActions> |
  ActionType<typeof EncryptionActions> |
  ActionType<typeof ExpensesActions> |
  ActionType<typeof PageActions> |
  ActionType<typeof PasswordRequirementActions> |
  NoopAction
