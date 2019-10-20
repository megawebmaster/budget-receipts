import { Action } from 'redux-first-router'

export enum AvailableRoutes {
  HOME = 'ROUTES/Home',
  EXPENSES = 'ROUTES/Expenses',
  EXPENSES_MONTH = 'ROUTES/ExpensesMonth',
  BUDGET = 'ROUTES/Budget',
  BUDGET_MONTH = 'ROUTES/BudgetMonth',
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
  type: AvailableRoutes.EXPENSES_MONTH,
  payload: ExpensesRoutePayload
}

export type BudgetRouteAction = Action & {
  type: AvailableRoutes.BUDGET_MONTH,
  payload: BudgetRoutePayload
}

export type RouteAction = ExpenseRouteAction | BudgetRouteAction
