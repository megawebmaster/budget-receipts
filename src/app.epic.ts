import { combineEpics } from 'redux-observable'
import { budgetEpic } from './components/budget'
import { categoriesEpic } from './components/categories'
import { expensesEpic, parseImageEpic } from './components/expenses'
import { pageEpic } from './components/page'
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
)
