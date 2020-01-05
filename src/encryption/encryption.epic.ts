import { combineEpics, Epic } from 'redux-observable'
import {
  catchError,
  concatMap,
  filter, finalize,
  ignoreElements,
  mergeMap,
  retry,
  retryWhen,
  switchMap,
  tap,
} from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppState } from '../app.store'
import { AppAction } from '../app.actions'
import * as Actions from './encryption.actions'
import { Encryption, EncryptionError } from './encryption'
import { budget as budgetSelector } from '../routes'
import { ApiAction } from '../api.actions'
import { requirePassword } from '../components/password-requirement'
import { Observable, throwError, timer } from 'rxjs'

const retryStrategy = ({ maxAttempts, state }: { maxAttempts: number, state: AppState }) =>
  (attempts: Observable<any>) =>
    attempts.pipe(
      tap(() => Encryption.removePassword(budgetSelector(state))),
      mergeMap((error, i) => {
        const retryAttempt = i + 1
        console.log('retrying for: ', retryAttempt)
        if (retryAttempt > maxAttempts) {
          return throwError(error)
        }

        // TODO: For a reason this is not retrying our calls...
        return timer(1)
      }),
      finalize(() => console.log('we need to log out - too many password attempts'))
    )

const setPasswordEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.setEncryptionPassword)),
    tap(({ payload }) => Encryption.setPassword(budgetSelector(state$.value), payload)),
    ignoreElements(),
  )

const decryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.decrypt)),
    switchMap(
      async (decryptionAction) => {
        const budget = budgetSelector(state$.value)
        if (!Encryption.hasEncryptionPassword(budget)) {
          return requirePassword(decryptionAction)
        }

        const { payload: { action, actionCreator, fields, numericFields } } = decryptionAction

        return actionCreator({
          source: action.source,
          value: await Promise.all(action.value.map(async (item: any) => ({
            ...item,
            ...Object.fromEntries(await Promise.all((fields || []).map(async (field) =>
              [field, await Encryption.decrypt(budget, item[field])],
            ))),
            ...Object.fromEntries(await Promise.all((numericFields || []).map(async (field) =>
              [field, parseFloat(await Encryption.decrypt(budget, item[field]))],
            ))),
          }))),
        }) as ApiAction
      },
    ),
    retryWhen(retryStrategy({ maxAttempts: 3, state: state$.value }))
    // catchError((error: Error, caught: Observable<AppAction>) => {
    //   if (error instanceof EncryptionError) {
    //     const budget = budgetSelector(state$.value)
    //     Encryption.removePassword(budget)
    //
    //     // TODO: Fix catching encryption/decryption errors and retry
    //     return caught.pipe(retry(1))
    //   }
    //
    //   throw error
    // })
  )

// const encryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
//   action$.pipe(
//     filter(isActionOf(Actions.encrypt)),
//     concatMap(({ payload }) => Encryption.encrypt(budget(state$.value), payload)),
//     map((text: string) => Actions.encryptedValue(text)),
//   )

export const encryptionEpic = combineEpics(
  setPasswordEpic,
  decryptValueEpic,
  // encryptValueEpic,
)
