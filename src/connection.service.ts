import { ActionType, PayloadActionCreator } from 'typesafe-actions'
import { decamelizeKeys } from 'humps'
import { Authenticator } from './app.auth'
import { AppAction } from './app.actions'
import { AppMessageType } from './components/message-list'
import { ApiRequest, SaveValue, DownloadValue } from './connection.types'
// noinspection TypeScriptPreferShortImport
import { pageError } from './components/page/page.actions'
import { noop } from './system.actions'

export class ConnectionService {
  static loadFromCache = async <TValue>(
    url: string,
    actionCreator: (payload: DownloadValue<TValue>) => AppAction,
  ): Promise<AppAction> => {
    const request = new Request(url, {
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': `Bearer ${Authenticator.getToken()}`,
      }),
    })
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
    url: string,
    actionCreator: (payload: DownloadValue<TValue>) => AppAction,
  ): Promise<AppAction> => {
    try {
      const request = new Request(url, {
        headers: new Headers({
          'Accept': 'application/json',
          'Authorization': `Bearer ${Authenticator.getToken()}`,
        }),
      })
      const response = await fetch(request)

      if (!response.ok) {
        return pageError({
          sticky: false,
          text: await response.json() as string,
          type: AppMessageType.ERROR,
        })
      }

      const cache = await caches.open('SimplyBudget')
      await cache.put(request, response.clone())

      return actionCreator({
        value: await response.json() as TValue[],
        source: 'network',
      })
    } catch (err) {
      console.error('fetch error', err)

      return pageError({
        text: 'Network connection failed',
        sticky: false,
        type: AppMessageType.ERROR,
      })
    }
  }

  static delete = async <TValue extends { id: number }>(
    data: ApiRequest<TValue>,
    actionCreator?: PayloadActionCreator<ActionType<AppAction>, SaveValue<TValue>>,
  ): Promise<AppAction> => ConnectionService._doRequest(data, 'DELETE', actionCreator)

  static create = async <TValue extends { id: number }>(
    data: ApiRequest<TValue>,
    actionCreator?: PayloadActionCreator<ActionType<AppAction>, SaveValue<TValue>>,
  ): Promise<AppAction> => ConnectionService._doRequest(data, 'POST', actionCreator)

  static update = async <TValue extends { id: number }>(
    data: ApiRequest<TValue>,
    actionCreator?: PayloadActionCreator<ActionType<AppAction>, SaveValue<TValue>>,
  ): Promise<AppAction> => ConnectionService._doRequest(data, 'PUT', actionCreator)

  static _doRequest = async <TValue extends { id: number }>(
    data: ApiRequest<TValue>,
    method: 'POST' | 'PUT' | 'DELETE',
    actionCreator?: PayloadActionCreator<ActionType<AppAction>, SaveValue<TValue>>,
  ): Promise<AppAction> => {
    try {
      const response = await fetch(new Request(data.url, {
        method,
        body: JSON.stringify(decamelizeKeys({
          ...data.params,
          value: data.value
        })),
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Authenticator.getToken()}`,
        }),
      }))

      if (!response.ok) {
        const result = await response.json()

        return pageError({
          sticky: false,
          text: Object.values(result).join('\n'),
          type: AppMessageType.ERROR,
        })
      }

      if (actionCreator) {
        const result = await response.json()

        return actionCreator({
          currentId: data.value?.id,
          value: result as TValue,
        })
      }

      return noop();
    } catch (err) {
      return pageError({
        sticky: false,
        text: 'Network connection failed',
        type: AppMessageType.ERROR,
      })
    }
  }
}
