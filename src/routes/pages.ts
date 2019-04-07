import { AvailableRoutes } from './routes'
import { ComponentType } from 'react'
import { NOT_FOUND } from 'redux-first-router'
import { Home } from '../components/home'
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
  [AvailableRoutes.EXPENSES]: {
    component: Expenses
  },
  [NOT_FOUND]: {
    component: NotFound
  },
}
