import { Action } from 'redux-first-router'

export type AvailableRoutes =
  'ROUTES/Home'
  | 'ROUTES/Expenses'
  | 'ROUTES/ExpensesMonth'
  | 'ROUTES/Budget'
  | 'ROUTES/BudgetEntries'
  | 'ROUTES/BudgetMonthEntries'
  | '@@redux-first-router/NOT_FOUND'

export const AvailableRoutes: Record<string, AvailableRoutes> = {
  HOME: 'ROUTES/Home',
  EXPENSES: 'ROUTES/Expenses',
  EXPENSES_MONTH: 'ROUTES/ExpensesMonth',
  BUDGET: 'ROUTES/Budget',
  BUDGET_ENTRIES: 'ROUTES/BudgetEntries',
  BUDGET_MONTH_ENTRIES: 'ROUTES/BudgetMonthEntries',
}

export type CommonRoutePayload = {
  budget: string
  year: number
  month: number
}

export type BudgetRoutePayload = {
} & CommonRoutePayload

export type ExpensesRoutePayload = {
} & CommonRoutePayload

export type ExpenseRouteAction = Action & {
  type: AvailableRoutes,
  payload: ExpensesRoutePayload
}

export type BudgetRouteAction = Action & {
  type: AvailableRoutes,
  payload: BudgetRoutePayload
}

export type RouteAction = ExpenseRouteAction | BudgetRouteAction
