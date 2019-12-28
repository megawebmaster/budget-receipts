import { Action } from 'redux-first-router'

export type AvailableRoutes =
  'ROUTES/Home'
  | 'ROUTES/Expenses'
  | 'ROUTES/ExpensesMonth'
  | 'ROUTES/Budget'
  | 'ROUTES/BudgetMonth'
  | '@@redux-first-router/NOT_FOUND'

export const AvailableRoutes: Record<string, AvailableRoutes> = {
  HOME: 'ROUTES/Home',
  EXPENSES: 'ROUTES/Expenses',
  EXPENSES_MONTH: 'ROUTES/ExpensesMonth',
  BUDGET: 'ROUTES/Budget',
  BUDGET_MONTH: 'ROUTES/BudgetMonth',
}

export type BudgetRoutePayload = {
  budget: string,
  year: number,
  month: number,
}

export type ExpensesRoutePayload = {
  budget: string,
  year: number,
  month: number,
}

export type ExpenseRouteAction = Action & {
  type: AvailableRoutes,
  payload: ExpensesRoutePayload
}

export type BudgetRouteAction = Action & {
  type: 'ROUTES/BudgetMonth',
  payload: BudgetRoutePayload
}

export type RouteAction = ExpenseRouteAction | BudgetRouteAction
