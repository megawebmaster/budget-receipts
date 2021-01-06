import { Action } from 'redux-first-router'

export type Route =
  'ROUTES/Home'
  | 'ROUTES/Expenses'
  | 'ROUTES/ExpensesMonth'
  | 'ROUTES/Budget'
  | 'ROUTES/BudgetEntries'
  | 'ROUTES/BudgetMonthEntries'
  | 'ROUTES/BudgetIrregular'
  | '@@redux-first-router/NOT_FOUND'

export const AvailableRoutes: Record<string, Route> = {
  HOME: 'ROUTES/Home',
  EXPENSES: 'ROUTES/Expenses',
  EXPENSES_MONTH: 'ROUTES/ExpensesMonth',
  BUDGET: 'ROUTES/Budget',
  BUDGET_ENTRIES: 'ROUTES/BudgetEntries',
  BUDGET_MONTH_ENTRIES: 'ROUTES/BudgetMonthEntries',
  BUDGET_IRREGULAR: 'ROUTES/BudgetIrregular'
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
  type: Route,
  payload: ExpensesRoutePayload
}

export type BudgetRouteAction = Action & {
  type: Route,
  payload: BudgetRoutePayload
}

export type RouteAction = ExpenseRouteAction | BudgetRouteAction
