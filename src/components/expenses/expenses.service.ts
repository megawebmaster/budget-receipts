import { AppAction } from '../../app.actions'
import { ApiReceipt } from './receipt.types'
import { receiptsLoadingError, updateReceipts } from './expenses.actions'
import { AppMessageType } from '../message-list'

export class ExpensesService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const content = await response.json() as { receipts: ApiReceipt[] }

      return updateReceipts({
        receipts: content.receipts,
        source: 'cache',
      })
    }

    return await updateReceipts({
      receipts: [
        {
          id: 1,
          date: 20,
          shop: 'Lidl',
          items: [
            { id: 1, category: 'c2', price: 200, description: 'Test 1' },
            { id: 2, category: 'c1', price: 100, description: 'Test 2' },
          ],
        },
        {
          id: 2,
          date: 21,
          shop: 'Biedronka',
          items: [
            { id: 3, category: 'c1', price: 100.23, description: 'Test 3' },
          ],
        },
      ],
      source: 'cache',
    })
  }

  static fetchFromNetwork = async (request: Request): Promise<AppAction> => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('SimplyBudget')
      cache.put(request, response.clone())

      const content = await response.json() as { receipts: ApiReceipt[] }

      return await updateReceipts({
        receipts: content.receipts,
        source: 'network',
      })
    } catch (err) {
      // return new Promise<AppAction>(resolve => {
      //   setTimeout(() => resolve(updateReceipts({
      //     receipts: [
      //       {
      //         id: 3,
      //         date: 20,
      //         shop: 'Lidl',
      //         items: [
      //           { id: 1, category: 'c2', price: 200, description: 'Test 1' },
      //           { id: 2, category: 'c1', price: 100, description: 'Test 2' },
      //         ],
      //       }],
      //     source: 'network',
      //   })), 1000)
      // })

      return await receiptsLoadingError({
        text: 'Network connection failed',
        sticky: false,
        type: AppMessageType.ERROR,
      })
    }
  }
}
