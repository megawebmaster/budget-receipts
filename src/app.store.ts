import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { connectRoutes, LocationState } from 'redux-first-router'
import { createEpicMiddleware } from 'redux-observable'

import { ExpensesState, reducer as expensesReducer } from './components/expenses'
import { routes } from './routes/routes'
import { appEpic } from './app.epic'
import { AppAction } from './app.actions'

export type AppState = {
  location: LocationState<string, any>,
  expenses: ExpensesState
}

export const configureStore = () => {
  const { reducer: locationReducer, middleware, enhancer } = connectRoutes(routes)
  const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState>();

  const rootReducer = combineReducers<AppState>({
    location: locationReducer,
    expenses: expensesReducer,
  })
  const middlewares = applyMiddleware(middleware, epicMiddleware)
  const enhancers = compose(enhancer, middlewares)

  const store = createStore(rootReducer, {}, enhancers)

  epicMiddleware.run(appEpic)

  return { store }
}
