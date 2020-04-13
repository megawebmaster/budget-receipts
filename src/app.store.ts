import { applyMiddleware, combineReducers, createStore, Store, StoreEnhancer } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRoutes, LocationState } from 'redux-first-router'
import { createEpicMiddleware } from 'redux-observable'

import { AuthState, reducer as authReducer } from './auth'
import { BudgetState, reducer as budgetReducer } from './components/budget'
import { ExpensesState, reducer as expensesReducer } from './components/expenses'
import { CategoriesState, reducer as categoriesReducer } from './components/categories'
import { PageState, reducer as pageReducer } from './components/page'
import { PasswordState, reducer as passwordReducer } from './components/password-requirement'
import { SettingsState, reducer as settingsReducer } from './components/settings'
import { routes } from './routes'
import { appEpic } from './app.epic'
import { AppAction } from './app.actions'

export type AppState = {
  auth: AuthState
  budget: BudgetState
  categories: CategoriesState
  expenses: ExpensesState
  location: LocationState<{}, any>
  page: PageState
  password: PasswordState
  settings: SettingsState
}

export const configureStore = () => {
  const { reducer: locationReducer, middleware, enhancer, initialDispatch } = connectRoutes<{}, AppState>(
    routes,
    { initialDispatch: false },
  )
  const epicMiddleware = createEpicMiddleware<AppAction, AppAction, AppState>()

  const rootReducer = combineReducers<AppState>({
    location: locationReducer,
    auth: authReducer,
    budget: budgetReducer,
    expenses: expensesReducer,
    categories: categoriesReducer,
    page: pageReducer,
    password: passwordReducer,
    settings: settingsReducer,
  })

  const composeEnhancers = composeWithDevTools({ trace: true })
  const enhancers = composeEnhancers(
    enhancer as unknown as StoreEnhancer<Store<any, AppAction>>,
    applyMiddleware(middleware, epicMiddleware),
  )

  const store = createStore(rootReducer, {}, enhancers)

  epicMiddleware.run(appEpic)
  initialDispatch && initialDispatch()

  return { store, epicMiddleware }
}
