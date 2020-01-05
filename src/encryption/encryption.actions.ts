import { createAction } from 'typesafe-actions'

export const setEncryptionPassword = createAction('ENCRYPTION/setPassword')<string>()
export const decrypt = createAction('ENCRYPTION/decrypt')<string>()
export const decryptedValue = createAction('ENCRYPTION/decryptedValue')<string>()
export const encrypt = createAction('ENCRYPTION/encrypt')<string>()
export const encryptedValue = createAction('ENCRYPTION/encryptedValue')<string>()
