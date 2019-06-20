import { AppAction } from '../../app.actions'
import { ApiReceipt, ParsingResult } from './receipt.types'
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

  static parseReceiptImage = async (image: Blob): Promise<string> => {
    return await 'the_token'
  }

  static getReceiptParsingResult = async (token: string): Promise<ParsingResult> => {
    return await {
      establishment: 'Lidl sp. z o.o. sp. k.',
      date: '2019-05-20 00:00:00',
      total: parseFloat('29.020'),
      lineItems: [
        {
          description: 'BIO BORÓWKA AMERYK.S F *',
          total: parseFloat('5.990'),
          supplementaryLineItems: {
            above: [],
            below: [
              {
                description: 'FILET Z P.KURCZAKA F',
                total: parseFloat('0.000'),
              },
            ],
          },
        },
        {
          description: '0,595 *',
          total: parseFloat('10.050'),
          supplementaryLineItems: {
            above: [
              {
                description: 'FILET Z P.KURCZAKA F',
                total: parseFloat('0.000'),
              },
            ],
            below: [],
          },
        },
        {
          description: 'KALAFIOR ŚWIEŻY 500G',
          total: parseFloat('6.990'),
        },
        {
          description: 'SZPARAGI ZIEL.500G 1 * 5',
          total: parseFloat('5.990'),
        },
      ],
    }
  }
}
