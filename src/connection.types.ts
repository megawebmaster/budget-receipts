import { ActionType, PayloadAction } from 'typesafe-actions'
import { AppAction } from './app.actions'

export type CreateValue<TValue> = {
  // TODO: Is this definition enough?
  currentId: number
  value: TValue
}

export type DownloadValue<TValue> = {
  value: TValue[]
  source: 'network' | 'cache'
}

export type RequestData = {
  body: any
  currentId: number
  url: string
}

// export type ApiCallAction<TValue> = (data: RequestData) => Promise<PayloadAction<ActionType<AppAction>, CreateValue<TValue>>>
