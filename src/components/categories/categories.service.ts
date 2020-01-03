import { decamelizeKeys } from 'humps'

import { AppAction, noop } from '../../app.actions'
import { AppMessageType } from '../message-list'
// noinspection TypeScriptPreferShortImport
import { pageError } from '../page/page.actions'

import { Category } from './category.types'
import { updateCategories } from './categories.actions'

const testCategories: Category[] = [
  {
    'id': 1,
    'name': 'Wynagrodzenie Adi',
    'type': 'income',
    'parent': null,
    'createdAt': '2018-05-13T01:18:16+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 4,
    'name': 'Wynagrodzenie Madzia',
    'type': 'income',
    'parent': null,
    'createdAt': '2018-05-13T11:56:39+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 7,
    'name': 'Jedzenie',
    'type': 'expense',
    'parent': null,
    'createdAt': '2018-05-13T11:57:08+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 8,
    'name': 'Mieszkanie',
    'type': 'expense',
    'parent': null,
    'createdAt': '2018-05-13T11:57:11+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 9,
    'name': 'Transport',
    'type': 'expense',
    'parent': null,
    'createdAt': '2018-05-13T11:57:13+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 15,
    'name': 'Dom',
    'type': 'expense',
    'parent': {
      'id': 7,
      'name': 'Jedzenie',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:08+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:57:48+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 16,
    'name': 'Praca',
    'type': 'expense',
    'parent': {
      'id': 7,
      'name': 'Jedzenie',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:08+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:57:49+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 17,
    'name': 'Miasto',
    'type': 'expense',
    'parent': {
      'id': 7,
      'name': 'Jedzenie',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:08+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:57:51+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 20,
    'name': 'Czynsz',
    'type': 'expense',
    'parent': {
      'id': 8,
      'name': 'Mieszkanie',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:11+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:58:00+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 21,
    'name': 'Prąd',
    'type': 'expense',
    'parent': {
      'id': 8,
      'name': 'Mieszkanie',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:11+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:58:01+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 22,
    'name': 'Internet',
    'type': 'expense',
    'parent': {
      'id': 8,
      'name': 'Mieszkanie',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:11+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:58:03+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 24,
    'name': 'Paliwo',
    'type': 'expense',
    'parent': {
      'id': 9,
      'name': 'Transport',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:13+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:58:12+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 25,
    'name': 'Bilety',
    'type': 'expense',
    'parent': {
      'id': 9,
      'name': 'Transport',
      'type': 'expense',
      'parent': null,
      'createdAt': '2018-05-13T11:57:13+02:00',
      'startedAt': '2018-01-01T00:00:00+01:00',
      'deletedAt': null,
      'averageValues': [],
    },
    'createdAt': '2018-05-13T11:58:14+02:00',
    'startedAt': '2018-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 39,
    'name': 'Prezenty',
    'type': 'irregular',
    'parent': null,
    'createdAt': '2019-05-13T11:59:13+02:00',
    'startedAt': '2019-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 40,
    'name': 'Leczenie',
    'type': 'irregular',
    'parent': null,
    'createdAt': '2019-05-13T11:59:15+02:00',
    'startedAt': '2019-01-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 93,
    'name': 'Nadpłata kredytu',
    'type': 'saving',
    'parent': null,
    'createdAt': '2019-12-01T19:49:03+01:00',
    'startedAt': '2019-12-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  }, {
    'id': 94,
    'name': 'Dzieci',
    'type': 'saving',
    'parent': null,
    'createdAt': '2019-12-01T19:49:18+01:00',
    'startedAt': '2019-12-01T00:00:00+01:00',
    'deletedAt': null,
    'averageValues': [],
  },
]

// TODO: These services are really similar: think of a way to extract it
export class CategoriesService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const categories = await response.json() as Category[]

      return updateCategories({
        categories,
        source: 'cache',
      })
    }

    return noop()
  }

  static fetchFromNetwork = async (request: Request): Promise<AppAction> => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('SimplyBudget')
      await cache.put(request, response.clone())

      const categories = await response.json() as Category[]

      return updateCategories({
        categories,
        source: 'network',
      })
    } catch (err) {
      // TODO: Restore error catching
      return new Promise<AppAction>(resolve => {
        setTimeout(() => resolve(updateCategories({
          categories: testCategories,
          source: 'network',
        })), 1000)
      })

      return pageError({
        text: 'Network connection failed',
        sticky: false,
        type: AppMessageType.ERROR,
      })
    }
  }

  static create = async (url: string, body: any): Promise<AppAction> =>
    CategoriesService._doRequest(url, body, 'POST')

  static update = async (url: string, body: any): Promise<AppAction> =>
    CategoriesService._doRequest(url, body, 'PUT')

  private static _doRequest = async (url: string, body: any, method: 'POST' | 'PUT'): Promise<AppAction> => {
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
