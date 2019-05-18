import { AppAction, noop } from '../../app.actions'
import { Receipt } from './receipt'
import { updateReceipts } from './expenses.actions'

export class ExpensesService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const content = await response.json() as { receipts: Receipt[] }

      return updateReceipts(content.receipts)
    }

    return await updateReceipts([
      {
        id: 1,
        date: 20,
        shop: "Lidl",
        items: [
          { id: 1, category: "c2", price: 200, description: "Test 1" },
          { id: 2, category: "c1", price: 100, description: "Test 2" },
        ],
      },
      {
        id: 2,
        date: 21,
        shop: "Biedronka",
        items: [
          { id: 3, category: "c1", price: 100.23, description: "Test 3" },
        ],
      },
    ])
  }

  static fetchFromNetwork = async (request: Request): Promise<AppAction> => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('SimplyBudget')
      cache.put(request, response.clone())

      const content = await response.json() as { receipts: Receipt[] }

      return await updateReceipts(content.receipts)
    } catch (err) {
      // TODO: Support connectivity issues message

      return await noop()
    }
  }
}