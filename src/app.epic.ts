import { combineEpics } from 'redux-observable'
import { budgetEpic } from './components/budget'
import { categoriesEpic } from './components/categories'
import { expensesEpic } from './components/expenses'
import { pageEpic } from './components/page'
import { passwordEpic } from './components/password-requirement'
import { encryptionEpic } from './encryption'

export const appEpic = combineEpics(
  budgetEpic,
  categoriesEpic,
  encryptionEpic,
  expensesEpic,
  pageEpic,
  passwordEpic,
)
