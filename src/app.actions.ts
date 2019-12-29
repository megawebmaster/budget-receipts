import { RouteAction } from './routes'
import { BudgetAction } from './components/budget'
import { ExpensesAction } from './components/expenses'
import { PageAction } from './components/page'

type NoopAction = {
  type: 'noop',
  payload: object
}

export const noop = (): NoopAction => ({
  type: 'noop',
  payload: {},
})

export type AppAction = RouteAction | BudgetAction | ExpensesAction | PageAction | NoopAction
