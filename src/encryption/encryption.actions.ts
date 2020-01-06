import { ActionType, createAction, getType, PayloadActionCreator } from 'typesafe-actions'
import { ApiRequest, SaveValue, DownloadValue } from '../connection.types'
import { ApiAction } from '../api.actions'

export const setEncryptionPassword = createAction('ENCRYPTION/setPassword')<string>()

type TypeWithId = { id: number }
type DecryptionActionCreator<TValue> = PayloadActionCreator<ActionType<ApiAction>, DownloadValue<TValue>>
type EncryptionActionCreator<TValue> = PayloadActionCreator<ActionType<ApiAction>, SaveValue<TValue>>
type ApiCall<TValue extends TypeWithId> = (
  data: ApiRequest<TValue>,
  actionCreator: PayloadActionCreator<ActionType<ApiAction>, SaveValue<TValue>>,
) => Promise<any>
type Fields<TValue> = (keyof TValue)[]

type DecryptionActionParams<TValue> = {
  actionCreator: DecryptionActionCreator<TValue>
  fields?: Fields<TValue>
  numericFields?: Fields<TValue>
}

type EncryptionActionParams<TValue extends TypeWithId> = {
  api: ApiCall<TValue>
  actionCreator: EncryptionActionCreator<TValue>
  fields?: Fields<TValue>
}

export const decrypt = createAction('ENCRYPTION/decrypt',
  <TValue>(
    action: TValue,
    actionCreator: DecryptionActionCreator<TValue>,
    name: string,
    fields?: Fields<TValue>,
    numericFields?: Fields<TValue>,
  ) => ({ action, actionCreator, fields, name, numericFields }),
)()

export const encrypt = createAction(
  'ENCRYPTION/encrypt',
  <TValue extends TypeWithId>(
    api: ApiCall<TValue>,
    actionCreator: EncryptionActionCreator<TValue>,
    data: TValue,
    name: string,
    fields?: Fields<TValue>,
  ) => ({ api, actionCreator, data, fields }),
)()

export const decryptAction =
  <TValue>({ actionCreator, fields, numericFields }: DecryptionActionParams<TValue>) =>
    (payload: DownloadValue<TValue>) => decrypt(payload, actionCreator, getType(actionCreator), fields, numericFields)

export const encryptAction =
  <TValue extends TypeWithId>({ api, actionCreator, fields }: EncryptionActionParams<TValue>) =>
    (data: ApiRequest<TValue>) => encrypt(api, actionCreator, data, getType(actionCreator), fields)

