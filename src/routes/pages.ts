import { AvailableRoutes } from './routes.types'
import { ComponentType } from 'react'
import { NOT_FOUND } from 'redux-first-router'
import { Home } from '../components/home'
import { Budget } from '../components/budget'
import { Expenses } from '../components/expenses'
import { NotFound } from '../components/not-found'
import { IrregularBudget } from '../components/budget/components/irregular-budget'

type Page = {
  component: ComponentType
  requiresLogin: boolean
  requiresPassword: boolean
}

export const pages: Record<AvailableRoutes, Page> = {
  'ROUTES/Home': {
    component: Home,
    requiresLogin: false,
    requiresPassword: false
  },
  'ROUTES/BudgetMonthEntries': {
    component: Budget,
    requiresLogin: true,
    requiresPassword: true
  },
  'ROUTES/BudgetIrregular': {
    component: IrregularBudget,
    requiresLogin: true,
    requiresPassword: true
  },
  'ROUTES/ExpensesMonth': {
    component: Expenses,
    requiresLogin: true,
    requiresPassword: true
  },
  'ROUTES/BudgetEntries': {
    component: NotFound,
    requiresLogin: true,
    requiresPassword: false
  },
  'ROUTES/Budget': {
    component: NotFound,
    requiresLogin: true,
    requiresPassword: false
  },
  'ROUTES/Expenses': {
    component: NotFound,
    requiresLogin: true,
    requiresPassword: false
  },
  [NOT_FOUND]: {
    component: NotFound,
    requiresLogin: false,
    requiresPassword: false
  },
}
