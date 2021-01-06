import { createSelector } from 'reselect'

import { AppState } from '../app.store'
import { AvailableRoutes, CommonRoutePayload, Route } from './routes.types'

export const location = (state: AppState) => state.location.type as Route

export const yearByLocation = createSelector(
  [location],
  (route: Route) =>
    route.indexOf('Budget') !== -1
      ? AvailableRoutes.BUDGET_ENTRIES
      : AvailableRoutes.EXPENSES
)

export const payload = (state: AppState) => state.location.payload as CommonRoutePayload

const defaultBudget = (state: AppState) => state.page.budgets.find(budget => budget.isDefault)

export const budget = createSelector(
  [payload, defaultBudget],
  (payload, budget) => payload.budget || (budget ? budget.slug : undefined),
)

export const year = createSelector(
  payload,
  (payload) => payload.year as number || new Date().getFullYear(),
)

export const month = createSelector(
  payload,
  (payload) => payload.month as number || new Date().getMonth() + 1,
)

export const budgetParams = createSelector(
  [budget, year, month],
  (budget, year, month) => ({ budget, year, month })
)
