export type CreateValue<TValue> = {
  // TODO: Is this definition enough?
  currentId: number
  value: TValue
}

export type DownloadValue<TValue> = {
  value: TValue[]
  source: 'network' | 'cache'
}
