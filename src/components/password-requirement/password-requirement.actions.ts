import { ActionType, createAction } from 'typesafe-actions'
import { RouteAction } from '../../routes'
import * as BudgetActions from '../budget/budget.actions'
import * as CategoriesActions from '../categories/categories.actions'
import * as ExpensesActions from '../expenses/expenses.actions'
import * as PageActions from '../page/page.actions'

export type AfterAction =
  RouteAction |
  ActionType<typeof BudgetActions> |
  ActionType<typeof CategoriesActions> |
  ActionType<typeof ExpensesActions> |
  ActionType<typeof PageActions>

export const requirePassword = createAction('PASSWORD/require')<AfterAction>()
export const continueActions = createAction('PASSWORD/continueActions')<void>()
