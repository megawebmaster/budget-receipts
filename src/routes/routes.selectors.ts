import { AppState } from '../app.store'
import { AvailableRoutes, BudgetRoutePayload, CommonRoutePayload, ExpensesRoutePayload } from './routes.types'
import { createSelector } from 'reselect'

export const location = (state: AppState) => state.location.type as AvailableRoutes

const commonPayload = (state: AppState) => state.location.payload as CommonRoutePayload
const expensesPayload = (state: AppState) => state.location.payload as ExpensesRoutePayload
const budgetPayload = (state: AppState) => state.location.payload as BudgetRoutePayload

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
