import { combineEpics, Epic } from 'redux-observable'
import { getType, isOfType } from 'typesafe-actions'
import { filter, ignoreElements, tap } from 'rxjs/operators'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { add } from './expenses.actions'

const addItemEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isOfType(getType(add))),
    tap((action) => console.log('add action', action)),
    ignoreElements()
  )

export const expensesEpic = combineEpics(
  addItemEpic,
)
