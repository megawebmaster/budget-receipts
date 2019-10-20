import { BudgetAction } from './components/budget'
import { ExpensesAction } from './components/expenses'
import { RouteAction } from './routes'

type NoopAction = {
  type: 'noop',
  payload: object
}

export const noop = (): NoopAction => ({
  type: 'noop',
  payload: {}
})

export type AppAction = BudgetAction | ExpensesAction | RouteAction | NoopAction
