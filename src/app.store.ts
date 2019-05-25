import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRoutes, LocationState } from 'redux-first-router'
import { createEpicMiddleware } from 'redux-observable'

import { ExpensesState, reducer as expensesReducer } from './components/expenses'
import { routes } from './routes'
import { appEpic } from './app.epic'
import { AppAction } from './app.actions'

export type AppState = {
  location: LocationState<{}, any>,
  expenses: ExpensesState
}

export const configureStore = () => {
  const { reducer: locationReducer, middleware, enhancer, initialDispatch } = connectRoutes<{}, AppState>(
    routes,
    { initialDispatch: false },
  )
  const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState>()

  const rootReducer = combineReducers<AppState>({
    location: locationReducer,
    expenses: expensesReducer,
  })
  const enhancers = composeWithDevTools(
    enhancer,
    applyMiddleware(middleware, epicMiddleware),
  )

  const store = createStore(rootReducer, {}, enhancers)

  epicMiddleware.run(appEpic)
  initialDispatch && initialDispatch()

  return { store, epicMiddleware }
}
