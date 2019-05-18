import { Action } from 'redux-first-router'

export enum AvailableRoutes {
  HOME = 'ROUTES/Home',
  EXPENSES = 'ROUTES/Expenses',
  EXPENSES_MONTH = 'ROUTES/ExpensesMonth',
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

export type RouteAction = ExpenseRouteAction
