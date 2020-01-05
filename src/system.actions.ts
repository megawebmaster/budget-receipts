export type NoopAction = {
  type: 'noop',
  payload: object
}

export const noop = (): NoopAction => ({
  type: 'noop',
  payload: {}
})
