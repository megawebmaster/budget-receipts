import { combineEpics } from 'redux-observable'
import { budgetEpic } from './components/budget'
import { expensesEpic } from './components/expenses'
import { pageEpic } from './components/page'

export const appEpic = combineEpics(
  budgetEpic,
  expensesEpic,
  pageEpic,
)
