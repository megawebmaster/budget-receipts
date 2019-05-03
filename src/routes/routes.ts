export enum AvailableRoutes {
  HOME = 'ROUTES/Home',
  EXPENSES = 'ROUTES/Expenses',
}

type RoutingTable = {
  [k in AvailableRoutes]: string
}

export type ExpensesRoutePayload = {
  year: number,
  month: number,
}

export const routes: RoutingTable = {
  [AvailableRoutes.HOME]: '/',
  [AvailableRoutes.EXPENSES]: '/:year/expenses/:month',
}
