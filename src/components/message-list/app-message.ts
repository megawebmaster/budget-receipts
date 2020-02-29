export enum AppMessageType {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
  DEFAULT = 'default'
}

export type AppMessage = {
  text: string
  sticky?: boolean
  translate?: boolean
  type: AppMessageType
}
