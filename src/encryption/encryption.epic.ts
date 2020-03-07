import { combineEpics, Epic } from 'redux-observable'
import { filter, ignoreElements, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { map, zip } from 'ramda'

import { AppState } from '../app.store'
import { AppAction } from '../app.actions'
import * as Actions from './encryption.actions'
import { Fields } from './encryption.actions'
import { Encryption } from './encryption'
import { Selectors as RouteSelectors } from '../routes'
import { ApiAction } from '../api.actions'
import { requirePassword } from '../components/password-requirement'
import { noop } from '../system.actions'

// const retryStrategy = ({ maxAttempts, state }: { maxAttempts: number, state: AppState }) =>
//   (attempts: Observable<any>) =>
//     attempts.pipe(
//       tap(() => Encryption.removePassword(budgetSelector(state))),
//       mergeMap((error, i) => {
//         const retryAttempt = i + 1
//         console.log('retrying for: ', retryAttempt)
//         if (retryAttempt > maxAttempts) {
//           return throwError(error)
//         }
//
//         // TODO: For a reason this is not retrying our calls...
//         return timer(1)
//       }),
//       finalize(() => console.log('we need to log out - too many password attempts')),
//     )

const setPasswordEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.setEncryptionPassword)),
    tap(({ payload }) => Encryption.setPassword(RouteSelectors.budget(state$.value), payload)),
    ignoreElements(),
  )

// TODO: Figure out if this can be typed better
const overFieldsOf = async <T extends { [k: string]: any }, K>(
  item: T,
  fields: Fields<T>,
  process: (value: string) => Promise<any>,
  parseValue: (value: string) => K = (v) => v as any as K,
): Promise<any> => {
  const processed = Object.keys(fields).map(async field => {
    if (item[field] && typeof item[field] === 'object') {
      const processedValue = await Promise.all(
        item[field].map(async (subitem: any) => ({
          ...subitem,
          ...(await overFieldsOf(subitem, fields[field] as Fields<any>, process)),
        })),
      )

      return [field, processedValue]
    }

    return [field, item[field] ? parseValue(await process(item[field].toString())) : '']
  })

  return Object.fromEntries(await Promise.all(processed))
}

const mapFieldsOf = <T extends { [k: string]: any }, K>(
  item: T,
  original: T,
  fields: Fields<T>,
): any => {
  const processed = Object.keys(fields).map(field => {
    if (item[field] && typeof item[field] === 'object') {
      const processedValue = map(([subitem, originalSubitem]) => ({
        ...subitem,
        ...mapFieldsOf(subitem, originalSubitem, fields[field] as Fields<any>),
      }), zip(item[field], original[field]))

      return [field, processedValue]
    }

    return [field, original[field] ? original[field] : '']
  })

  return {
    ...original,
    ...item,
    ...Object.fromEntries(processed),
  }
}

const decryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.decrypt)),
    mergeMap(
      async (decryptionAction) => {
        const budget = RouteSelectors.budget(state$.value)
        if (!Encryption.hasEncryptionPassword(budget)) {
          return requirePassword(decryptionAction)
        }

        const { payload: { action, actionCreator, fields, numericFields } } = decryptionAction
        const decrypt = (value: string) => Encryption.decrypt(budget, value)

        return actionCreator({
          source: action.source,
          value: await Promise.all(action.value.map(async (item: any) => ({
            ...item,
            ...await overFieldsOf(item, fields || {}, decrypt),
            ...await overFieldsOf(item, numericFields || {}, decrypt, parseFloat),
          }))),
        }) as ApiAction
      },
    ),
    // retryWhen(retryStrategy({ maxAttempts: 3, state: state$.value }))
    // catchError((error: Error) => {
    //   if (error instanceof EncryptionError) {
    //     console.log('decryption failed', error)
    //
    //     // TODO: Fix catching encryption/decryption errors and retry
    //     return []
    //   }
    //
    //   throw error
    // }),
  )

const encryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.encrypt)),
    mergeMap(
      async (encryptAction) => {
        const budget = RouteSelectors.budget(state$.value)
        if (!Encryption.hasEncryptionPassword(budget)) {
          return requirePassword(encryptAction)
        }

        const { payload: { api, actionCreator, data, fields } } = encryptAction
        const encrypt = (value: string) => Encryption.encrypt(budget, value)

        const request = {
          ...data,
          value: {
            ...data.value,
            ...await overFieldsOf(data.value, fields || {}, encrypt),
          },
        }

        if (actionCreator) {
          return await api(request, ({ currentId, value }) => actionCreator({
            currentId,
            value: mapFieldsOf(value, data.value, fields || {}),
          }))
        }

        api(request)

        return noop()
      },
    ),
    // retryWhen(retryStrategy({ maxAttempts: 3, state: state$.value }))
  )

export const encryptionEpic = combineEpics(
  setPasswordEpic,
  decryptValueEpic,
  encryptValueEpic,
)
