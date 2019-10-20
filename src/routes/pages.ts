import { AvailableRoutes } from './routes.types'
import { ComponentType } from 'react'
import { NOT_FOUND } from 'redux-first-router'
import { Home } from '../components/home'
import { Budget } from '../components/budget'
import { Expenses } from '../components/expenses'
import { NotFound } from '../components/not-found'

type Page = { component: ComponentType }
type PageTable = {
  [k in AvailableRoutes]: Page
} & {
  [NOT_FOUND]: Page
}

export const pages: PageTable = {
  [AvailableRoutes.HOME]: {
    component: Home
  },
  [AvailableRoutes.BUDGET_MONTH]: {
    component: Budget
  },
  [AvailableRoutes.BUDGET]: {
    component: NotFound
  },
  [AvailableRoutes.EXPENSES_MONTH]: {
    component: Expenses
  },
  [AvailableRoutes.EXPENSES]: {
    component: NotFound
  },
  [NOT_FOUND]: {
    component: NotFound
  },
}
