import { combineEpics } from 'redux-observable'
import { budgetEpic } from './components/budget'
import { expensesEpic } from './components/expenses'

export const appEpic = combineEpics(
  budgetEpic,
  expensesEpic,
)
