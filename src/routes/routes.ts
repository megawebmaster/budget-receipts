import { redirect, RoutesMap } from "redux-first-router"
import { AppState } from "../app.store"
import { expensesYear } from "./routes.selectors"
import { AvailableRoutes } from "./routes.types"

export const routes: RoutesMap<{}, AppState> = {
  [AvailableRoutes.HOME]: "/",
  [AvailableRoutes.EXPENSES]: {
    path: "/:year/expenses",
    thunk: (dispatch, getState) => {
      const state: AppState = getState()
      const year = expensesYear(state)
      dispatch(redirect({
        type: AvailableRoutes.EXPENSES_MONTH,
        payload: { year, month: new Date().getMonth() + 1 },
      }))
    },
  },
  [AvailableRoutes.EXPENSES_MONTH]: {
    path: "/:year/expenses/:month",
    coerceNumbers: true,
  },
}
