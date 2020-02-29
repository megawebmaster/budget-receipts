import { combineEpics, Epic } from 'redux-observable'
import { filter, ignoreElements } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppAction } from '../app.actions'
import { AppState } from '../app.store'
import * as Actions from './auth0.actions'

const loginEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.login)),
    ignoreElements(),
  )

export const authEpic = combineEpics(
  loginEpic,
)
