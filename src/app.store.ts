import { applyMiddleware, combineReducers, createStore, Store, StoreEnhancer } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRoutes, LocationState } from 'redux-first-router'
import { createEpicMiddleware } from 'redux-observable'

import { ExpensesState, reducer as expensesReducer } from './components/expenses'
import { CategoriesState, reducer as categoriesReducer } from './components/categories'
import { routes } from './routes'
import { appEpic } from './app.epic'
import { AppAction } from './app.actions'

export type AppState = {
  categories: CategoriesState
  expenses: ExpensesState
  location: LocationState<{}, any>
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
    categories: categoriesReducer,
  })
  const enhancers = composeWithDevTools(
    enhancer as unknown as StoreEnhancer<Store<any, AppAction>, {}>,
    applyMiddleware(middleware, epicMiddleware),
  )

  const store = createStore(rootReducer, {}, enhancers)

  epicMiddleware.run(appEpic)
  initialDispatch && initialDispatch()

  return { store, epicMiddleware }
}
