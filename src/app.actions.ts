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

export type AppAction = ExpensesAction | RouteAction | NoopAction
