import { ActionType, PayloadActionCreator } from 'typesafe-actions'
import { decamelizeKeys } from 'humps'
import { AppAction, noop } from './app.actions'
import { AppMessageType } from './components/message-list'
// noinspection TypeScriptPreferShortImport
import { pageError } from './components/page/page.actions'
import { DownloadValue } from './connection.types'

export class ConnectionService {
  static loadFromCache = async <TValue>(
    request: Request,
    actionCreator: PayloadActionCreator<ActionType<AppAction>, DownloadValue<TValue>>,
  ): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()

      return actionCreator({
        value: await response.json() as TValue[],
        source: 'cache',
      })
    }

    return noop()
  }

  static fetchFromNetwork = async <TValue>(
    request: Request,
    actionCreator: PayloadActionCreator<ActionType<AppAction>, DownloadValue<TValue>>,
  ): Promise<AppAction> => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('SimplyBudget')
      await cache.put(request, response.clone())

      return actionCreator({
        value: await response.json() as TValue[],
        source: 'network',
      })
    } catch (err) {
      return pageError({
        text: 'Network connection failed',
        sticky: false,
        type: AppMessageType.ERROR,
      })
    }
  }

  static create = async (url: string, body: any): Promise<AppAction> =>
    ConnectionService._doRequest(url, body, 'POST')

  static delete = async (url: string, body: any): Promise<AppAction> =>
    ConnectionService._doRequest(url, body, 'DELETE')

  // TODO: Fix API to either always use PUT or PATCH method
  static update = async (url: string, body: any): Promise<AppAction> =>
    ConnectionService._doRequest(url, body, 'PUT')

  private static _doRequest = async (url: string, body: any, method: 'POST' | 'PUT' | 'DELETE'): Promise<AppAction> => {
    try {
      const response = await fetch(new Request(url, {
        method,
        body: JSON.stringify(decamelizeKeys(body)),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${Authenticator.getToken()}`,
        }),
      }))

      if (!response.ok) {
        const result = await response.json()

        return pageError({
          sticky: false,
          text: Object.values(result).join('\n'),
          type: AppMessageType.ERROR
        });
      }

      return noop()
    } catch (err) {
      return pageError({
        sticky: false,
        text: 'Network connection failed',
        type: AppMessageType.ERROR,
      })
    }
  }
}
