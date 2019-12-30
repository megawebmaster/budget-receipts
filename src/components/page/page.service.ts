import { AppAction, noop } from '../../app.actions'
import { AppMessageType } from '../message-list'

import { Budget } from './budget.types'
import { pageError, updateBudgets } from './page.actions'

const budgetsCache: Budget[] = [{
  'id': 1,
  'userId': 'email|5ad319273020501cd4911d4f',
  'name': 'Domowy',
  'slug': 'domowy',
  'isDefault': true,
  'abilities': null,
  'recipient': '',
  // 'recipient': 'wy4ECQMIG9m7lsyLSatgWtJvW5i79Y2Ff3h1bnMWQxlU92zTXdlEsvyLR7c+8IR60k8BN9+0INohjhE3dd7scsIUH6zqsMEy12lPHWEgHfLUq6K\/rzTT5HrlfdbxJAln5uEq+2kFqy0vVfbWlVriGch+4jRoc8pP2WBDix4aiZW+',
  'ownerId': 'email|5ad319273020501cd4911d4f',
}]

export class PageService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const budgets = await response.json() as Budget[]

      return updateBudgets({
        budgets,
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

      const budgets = await response.json() as Budget[]

      return updateBudgets({
        budgets,
        source: 'network',
      })
    } catch (err) {
      // TODO: Restore error catching
      return new Promise<AppAction>(resolve => {
        setTimeout(() => resolve(updateBudgets({
          budgets: budgetsCache,
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
}
