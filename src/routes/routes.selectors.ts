import { AppState } from '../app.store'
import { AvailableRoutes, BudgetRoutePayload, ExpensesRoutePayload } from './routes.types'
import { createSelector } from 'reselect'

export const location = (state: AppState) => state.location.type as AvailableRoutes

const expensesPayload = (state: AppState) => state.location.payload as ExpensesRoutePayload

export const expensesBudget = createSelector(
  expensesPayload,
  (payload) => payload.budget,
)

export const expensesYear = createSelector(
  expensesPayload,
  (payload) => payload.year as number || new Date().getFullYear(),
)

export const expensesMonth = createSelector(
  expensesPayload,
  (payload) => payload.month as number || new Date().getMonth() + 1,
)

const budgetPayload = (state: AppState) => state.location.payload as BudgetRoutePayload

export const budgetBudget = createSelector(
  budgetPayload,
  (payload) => payload.budget,
)

export const budgetYear = createSelector(
  budgetPayload,
  (payload) => payload.year as number || new Date().getFullYear(),
)

export const budgetMonth = createSelector(
  budgetPayload,
  (payload) => payload.month as number || new Date().getMonth() + 1,
)
