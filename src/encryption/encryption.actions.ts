import { ActionType, createAction, getType, PayloadActionCreator } from 'typesafe-actions'
import { DownloadValue } from '../connection.types'
import { ApiAction } from '../api.actions'

export const setEncryptionPassword = createAction('ENCRYPTION/setPassword')<string>()

type DecryptionActionCreator<TValue> = PayloadActionCreator<ActionType<ApiAction>, DownloadValue<TValue>>
type Fields<TValue> = (keyof TValue)[]

type DecryptionActionParams<TValue> = {
  actionCreator: DecryptionActionCreator<TValue>
  fields?: Fields<TValue>
  numericFields?: Fields<TValue>
}

// type EncryptionActionParams<TValue> = {
//   call: ApiCallAction<TValue>
//   request: RequestData
//   fields?: Fields<TValue>
//   numericFields?: Fields<TValue>
// }

export const decrypt = createAction('ENCRYPTION/decrypt',
  <TValue>(
    action: TValue,
    actionCreator: DecryptionActionCreator<TValue>,
    name: string,
    fields?: Fields<TValue>,
    numericFields?: Fields<TValue>,
  ) => ({ action, actionCreator, fields, name, numericFields }),
)()

// export const encrypt = createAction(
//   'ENCRYPTION/encrypt',
//   <TValue>(
//     call: ApiCallAction<TValue>,
//     request: RequestData,
//     fields?: Fields<TValue>,
//     numericFields?: Fields<TValue>,
//   ) => ({ call, fields, request, numericFields }),
// )()

export const decryptAction =
  <TValue>({ actionCreator, fields, numericFields }: DecryptionActionParams<TValue>) =>
    (payload: DownloadValue<TValue>) => decrypt(payload, actionCreator, getType(actionCreator), fields, numericFields)

// export const encryptAction =
//   <TValue>({ call, fields, numericFields }: EncryptionActionParams<TValue>) =>
//     (request: RequestData) => encrypt(call, request, fields, numericFields)


