export enum AvailableRoutes {
  HOME = 'ROUTES/Home',
  EXPENSES = 'ROUTES/Expenses',
}

type RoutingTable = {
  [k in AvailableRoutes]: string
}

export const routes: RoutingTable = {
  [AvailableRoutes.HOME]: '/',
  [AvailableRoutes.EXPENSES]: '/expenses',
}
