import { AvailableRoutes } from './routes.types'
import { ComponentType } from 'react'
import { NOT_FOUND } from 'redux-first-router'
import { Home } from '../components/home'
import { Budget } from '../components/budget'
import { Expenses } from '../components/expenses'
import { NotFound } from '../components/not-found'

type Page = { component: ComponentType }

export const pages: Record<AvailableRoutes, Page> = {
  'ROUTES/Home': {
    component: Home
  },
  'ROUTES/BudgetMonth': {
    component: Budget
  },
  'ROUTES/ExpensesMonth': {
    component: Expenses
  },
  'ROUTES/Budget': {
    component: NotFound
  },
  'ROUTES/Expenses': {
    component: NotFound
  },
  [NOT_FOUND]: {
    component: NotFound
  },
}
