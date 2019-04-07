import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { connectRoutes, LocationState } from 'redux-first-router'

import { routes } from './routes/routes'
import { ExpensesState, reducer as expensesReducer } from './components/expenses'

export type AppState = {
  location: LocationState<string, any>,
  expenses: ExpensesState
}

export const configureStore = () => {
  const { reducer: locationReducer, middleware, enhancer } = connectRoutes(routes)

  const rootReducer = combineReducers<AppState>({
    location: locationReducer,
    expenses: expensesReducer,
  })
  const middlewares = applyMiddleware(middleware)
  const enhancers = compose(enhancer, middlewares)

  const store = createStore(rootReducer, {}, enhancers)

  return { store }
}
