export type SaveValue<TValue> = {
  currentId?: number
  value: TValue
}

export type DownloadValue<TValue> = {
  source: 'network' | 'cache'
  value: TValue[]
}

export type ApiRequest<TValue extends { id: number }> = {
  params?: Record<string, any>
  url: string
  value?: TValue
}
