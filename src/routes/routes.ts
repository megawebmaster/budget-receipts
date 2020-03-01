import { redirect, RoutesMap, StateGetter } from 'redux-first-router'
import { Dispatch } from 'redux'
import { AppState } from '../app.store'
import { budget as budgetSelector, year as yearSelector, month as monthSelector } from './routes.selectors'
import { AvailableRoutes } from './routes.types'

const redirectToBudgetMonth = (dispatch: Dispatch, getState: StateGetter) => {
  const state: AppState = getState()
  const budget = budgetSelector(state)
  const year = yearSelector(state)
  const month = monthSelector(state)
  dispatch(redirect({
    type: AvailableRoutes.BUDGET_MONTH_ENTRIES,
    payload: { budget, year, month },
  }))
}

const redirectToMonthExpenses = (dispatch: Dispatch, getState: StateGetter) => {
  const state: AppState = getState()
  const budget = budgetSelector(state)
  const year = yearSelector(state)
  const month = monthSelector(state)
  dispatch(redirect({
    type: AvailableRoutes.EXPENSES_MONTH,
    payload: { budget, year, month },
  }))
}

export const routes: RoutesMap<{}, AppState> = {
  [AvailableRoutes.HOME]: '/',
  [AvailableRoutes.EXPENSES]: {
    path: '/:budget/:year/expenses',
    thunk: redirectToMonthExpenses,
  },
  [AvailableRoutes.EXPENSES_MONTH]: {
    path: '/:budget/:year/expenses/month/:month',
    coerceNumbers: true,
  },
  [AvailableRoutes.BUDGET]: {
    path: '/:budget',
    thunk: redirectToBudgetMonth,
  },
  [AvailableRoutes.BUDGET_ENTRIES]: {
    path: '/:budget/:year/budget',
    thunk: redirectToBudgetMonth,
  },
  [AvailableRoutes.BUDGET_MONTH_ENTRIES]: {
    path: '/:budget/:year/budget/month/:month',
    coerceNumbers: true,
  },
  [AvailableRoutes.BUDGET_IRREGULAR]: {
    path: '/:budget/:year/budget/irregular',
    coerceNumbers: true,
  },
}
