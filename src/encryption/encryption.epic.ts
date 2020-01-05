import { combineEpics, Epic } from 'redux-observable'
import { concatMap, filter, ignoreElements, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppState } from '../app.store'
import { AppAction } from '../app.actions'
import * as Actions from './encryption.actions'
import { Encryption } from './encryption'
import { budget } from '../routes'

const setPasswordEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.setEncryptionPassword)),
    tap(({ payload }) => Encryption.setPassword(budget(state$.value), payload)),
    ignoreElements(),
  )

const decryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.decrypt)),
    concatMap(({ payload }) => Encryption.decrypt(budget(state$.value), payload)),
    map((text: string) => Actions.decryptedValue(text)),
  )

const encryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.encrypt)),
    concatMap(({ payload }) => Encryption.encrypt(budget(state$.value), payload)),
    map((text: string) => Actions.encryptedValue(text)),
  )

export const encryptionEpic = combineEpics(
  setPasswordEpic,
  decryptValueEpic,
  encryptValueEpic,
)
