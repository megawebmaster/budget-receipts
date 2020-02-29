import { combineEpics } from 'redux-observable'
import { budgetEpic } from './components/budget'
import { categoriesEpic } from './components/categories'
import { expensesEpic, parseImageEpic } from './components/expenses'
import { pageEpic } from './components/page'
import { passwordEpic } from './components/password-requirement'
import { encryptionEpic } from './encryption'
import { authEpic } from './auth'

export const appEpic = combineEpics(
  authEpic,
  budgetEpic,
  categoriesEpic,
  encryptionEpic,
  expensesEpic,
  pageEpic,
  parseImageEpic,
  passwordEpic,
)
