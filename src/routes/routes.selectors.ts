import { AppState } from '../app.store'
import { AvailableRoutes, ExpensesRoutePayload } from "./routes"
import { createSelector } from "reselect"

export const location = (state: AppState) => state.location.type as AvailableRoutes

const expensesPayload = (state: AppState) => state.location.payload as ExpensesRoutePayload

export const expensesYear = createSelector(
  expensesPayload,
  (payload) => payload.year as number || new Date().getFullYear()
)

export const expensesMonth = createSelector(
  expensesPayload,
  (payload) => payload.month as number || new Date().getMonth() + 1
)
