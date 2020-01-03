export type DownloadValue<TValue> = {
  value: TValue[]
  source: 'network' | 'cache'
}
