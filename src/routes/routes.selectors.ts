import { AppState } from '../app.store'
import { AvailableRoutes, CommonRoutePayload } from './routes.types'
import { createSelector } from 'reselect'

export const location = (state: AppState) => state.location.type as AvailableRoutes

export const yearByLocation = createSelector(
  [location],
  (route: AvailableRoutes) =>
    route.indexOf('Budget') !== -1
      ? AvailableRoutes.BUDGET_ENTRIES
      : AvailableRoutes.EXPENSES
)

const commonPayload = (state: AppState) => state.location.payload as CommonRoutePayload
// const expensesPayload = (state: AppState) => state.location.payload as ExpensesRoutePayload
// const budgetPayload = (state: AppState) => state.location.payload as BudgetRoutePayload

export const budget = createSelector(
  commonPayload,
  (payload) => payload.budget,
)

export const year = createSelector(
  commonPayload,
  (payload) => payload.year as number || new Date().getFullYear(),
)

export const month = createSelector(
  commonPayload,
  (payload) => payload.month as number || new Date().getMonth() + 1,
)
