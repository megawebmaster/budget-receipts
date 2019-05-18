import { combineEpics } from 'redux-observable'
import { expensesEpic } from './components/expenses'

export const appEpic = combineEpics(
  expensesEpic,
)
