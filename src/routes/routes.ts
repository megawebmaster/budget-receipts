import { redirect, RoutesMap } from 'redux-first-router'
import { AppState } from '../app.store'
import { expensesBudget, expensesYear } from './routes.selectors'
import { AvailableRoutes } from './routes.types'

export const routes: RoutesMap<{}, AppState> = {
  [AvailableRoutes.HOME]: '/',
  [AvailableRoutes.EXPENSES]: {
    path: '/:budget/:year/expenses',
    thunk: (dispatch, getState) => {
      const state: AppState = getState()
      const budget = expensesBudget(state)
      const year = expensesYear(state)
      dispatch(redirect({
        type: AvailableRoutes.EXPENSES_MONTH,
        payload: { budget, year, month: new Date().getMonth() + 1 },
      }))
    },
  },
  [AvailableRoutes.EXPENSES_MONTH]: {
    path: '/:budget/:year/expenses/:month',
    coerceNumbers: true,
  },
}
