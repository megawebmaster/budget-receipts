import { ActionType } from 'typesafe-actions'
import * as BudgetActions from './components/budget/budget.actions'
import * as CategoriesActions from './components/categories/categories.actions'
import * as ExpensesActions from './components/expenses/expenses.actions'
import * as IrregularBudgetActions from './components/irregular-budget/irregular-budget.actions'
import * as PageActions from './components/page/page.actions'

export type ApiAction =
  ActionType<typeof BudgetActions> |
  ActionType<typeof CategoriesActions> |
  ActionType<typeof ExpensesActions> |
  ActionType<typeof IrregularBudgetActions> |
  ActionType<typeof PageActions>
