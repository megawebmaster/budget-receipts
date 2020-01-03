import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

import { AppAction } from '../../app.actions'
import { AvailableRoutes } from '../../routes'
import { Category } from './category.types'
import { CreateCategory } from './categories.actions'
import * as Actions from './categories.actions'

export type CategoriesState = {
  categories: Category[]
  loading: boolean
}

const newCategory =
  (state: CategoriesState['categories'], { parentId, type, value }: CreateCategory): Category[] => [
    ...state,
    {
      type,
      averageValues: [],
      id: Date.now(),
      name: value,
      parent: parentId ? state.find(category => category.id === parentId) || null : null,
      createdAt: new Date().toString(),
      deletedAt: null,
      startedAt: new Date().toString(),
    },
  ]


const categories: Category[] = [
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

const categoriesReducer: Reducer<CategoriesState['categories'], AppAction> = (state = categories, action) => {
  switch (action.type) {
    case getType(Actions.updateCategories): {
      return action.payload.value
    }
    case getType(Actions.createCategory): {
      return newCategory(state, action.payload)
    }
    default:
      return state
  }
}

// TODO: Restore state value and route reset to true
const loadingReducer: Reducer<CategoriesState['loading'], AppAction> = (state = false, action) => {
  switch (action.type) {
    case AvailableRoutes.BUDGET:
      return false
    case getType(Actions.updateCategories):
      return action.payload.source !== 'network'
    default:
      return state
  }
}

export const reducer = combineReducers({
  categories: categoriesReducer,
  loading: loadingReducer,
})
