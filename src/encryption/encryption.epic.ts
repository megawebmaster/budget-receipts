import { ActionsObservable, combineEpics, Epic } from 'redux-observable'
import { concat, from, of } from 'rxjs'
import { catchError, filter, ignoreElements, mergeMap, take, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { map as mapItems, zip } from 'ramda'

import { AppState } from '../app.store'
import { AppAction } from '../app.actions'
import * as Actions from './encryption.actions'
import { Fields } from './encryption.actions'
import { Encryption } from './encryption'
import { Selectors as RouteSelectors } from '../routes'
import { ApiAction } from '../api.actions'
import { requirePassword } from '../components/password-requirement'
import { noop } from '../system.actions'

const setPasswordEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.setPassword)),
    tap(({ payload }) => Encryption.setPassword(RouteSelectors.budget(state$.value), payload)),
    ignoreElements(),
  )

const resetPasswordEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.resetPassword)),
    tap(() => Encryption.removePassword(RouteSelectors.budget(state$.value))),
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
      const processedValue = mapItems(([subitem, originalSubitem]) => ({
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

const waitForPassword = (action$: ActionsObservable<AppAction>) =>
  action$.pipe(
    filter(isActionOf(Actions.setPassword)),
    take(1),
  )

// TODO: Encryption and decryption should not block app
const decryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.decrypt)),
    mergeMap(
      (decryptionAction) => {
        const budget = RouteSelectors.budget(state$.value)
        if (!Encryption.hasEncryptionPassword(budget)) {
          return concat(
            of(requirePassword()),
            waitForPassword(action$),
            of(decryptionAction),
          )
        }

        const { action, actionCreator, fields, numericFields } = decryptionAction.payload
        const decrypt = (value: string) => Encryption.decrypt(budget, value)

        return from(
          (async () =>
            actionCreator({
              source: action.source,
              value: await Promise.all(action.value.map(async (item: any) => ({
                ...item,
                ...await overFieldsOf(item, fields || {}, decrypt),
                ...await overFieldsOf(item, numericFields || {}, decrypt, parseFloat),
              }))),
            }) as ApiAction)(),
        ).pipe(
          catchError(() => concat(
            of(Actions.resetPassword()),
            of(requirePassword()),
            waitForPassword(action$),
            of(decryptionAction),
          )),
        )
      },
    ),
  )

const logoutAfterTooManyAttemptsEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.setPassword)),
    ignoreElements(),
  )

const encryptValueEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.encrypt)),
    mergeMap(
      async (encryptAction) => {
        const budget = RouteSelectors.budget(state$.value)
        if (!Encryption.hasEncryptionPassword(budget)) {
          window.location.reload()
          return noop()
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
  )

export const encryptionEpic = combineEpics(
  setPasswordEpic,
  resetPasswordEpic,
  logoutAfterTooManyAttemptsEpic,
  decryptValueEpic,
  encryptValueEpic,
)
