export enum AvailableRoutes {
  HOME = "ROUTES/Home",
  EXPENSES = "ROUTES/Expenses",
  EXPENSES_MONTH = "ROUTES/ExpensesMonth",
}

export type ExpensesRoutePayload = {
  year: number,
  month: number,
}
