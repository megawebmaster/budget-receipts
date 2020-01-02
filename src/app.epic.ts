import { combineEpics } from 'redux-observable'
import { budgetEpic } from './components/budget'
import { categoriesEpic } from './components/categories'
import { expensesEpic } from './components/expenses'
import { pageEpic } from './components/page'

export const appEpic = combineEpics(
  budgetEpic,
  categoriesEpic,
  expensesEpic,
  pageEpic,
)
