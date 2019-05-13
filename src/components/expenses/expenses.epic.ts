import { combineEpics, Epic } from 'redux-observable'
import { getType, isOfType } from 'typesafe-actions'
import { filter, ignoreElements, tap } from 'rxjs/operators'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { addReceiptItem } from './expenses.actions'

const addItemEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isOfType(getType(addReceiptItem))),
    tap((action) => console.log('add receipt item action', action.payload)),
    ignoreElements()
  )

export const expensesEpic = combineEpics(
  addItemEpic,
)
