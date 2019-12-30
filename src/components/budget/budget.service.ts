import { AppAction, noop } from '../../app.actions'
import { AppMessageType } from '../message-list'
import { BudgetEntry } from './budget-entry.types'
import { updateEntries } from './budget.actions'
import { pageError } from '../page'

const budgetEntries = [
  {
    'id': 411,
    'category': { 'id': 4, 'type': 'income', 'parent': null },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMIxU5t5NmZ\/pdgndDbVs3VxxoL5iQZciE+tyKFskbLRNpH0xAH4h+dWhH00j8BT0uS4H9rWsv6RT0fUcgPUKcVkefmxOuYX300l+31vBtGI\/JSXsQqZywid4k355CimlHsbAtplTpcFYbkfVQ=',
    // 'real': 'wy4ECQMI0gNPW9hH1H1glClbY54qK9L0uMg+gWqo+jpX+eWumYlqBmeDeL5dSuX60j8BnWfCNgtU3i+iUQZ8aXv2AOy2zJZBBHyKX7ZoWbhvI1tCziRGr06M8qA80bQh91ylmLfsLcigBTJTXlwCqqw=',
    'monthlyRealValues': [],
  }, {
    'id': 413,
    'category': { 'id': 1, 'type': 'income', 'parent': null },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMIceLeBQKgvzlgq3tU9lHoYMGRR47M3h6UdpiBJHdf4gqvWnN\/X4Iszizo0kABDtIRq+sXl1sxqUdNm4xxivrnrxCSVvn\/gbsK1sRerakzV2QLto5CXmxXbBkis9RW7QX64+NjXZvsJ47UeoEM',
    // 'real': 'wy4ECQMIPi3\/5tvdYlhgDmfQLJohnrArTqYM41yP5mIqaOFzYNdoOL6vugY0f7OQ0kABn2mkC4TxcXpsZkL8c+jKIPWpkP+NNV8t8\/tHpSh82G0t8oQCH8g5eDepyYHIY7t+dt5\/9DzCgeKhWSTiwUdB',
    'monthlyRealValues': [],
  }, {
    'id': 414,
    'category': { 'id': 15, 'type': 'expense', 'parent': { 'id': 7 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMI4uG1OkTX7AZgwUJoQEcX2O4KW4IWBuODGMP+kzUtRrIwjJ0oiN+humJC0jkBBUFbArVW7kRs0g+tcUS9\/OVxB9L6JFplUhQz5Mi9zAOZQW0qm8AuTOEr8pZ6LtD+05fiFSEaqpw=',
    // 'real': 'wy4ECQMIg+NuokTxHZNgJ5E1EIxAVl06pEKz8HBFGlGb6ChE8oHnIUsvOdZr1K4E0kkBGrP1adMulSL4R3PPWIsyCNzE12Z8jOtGfRyJQ50dQsaevFg4H6P9rlOtTth21r0OyQIES+GEpdb7CJuEFPkCUK+Ru8e7Z+7g',
    'monthlyRealValues': [],
  }, {
    'id': 415,
    'category': { 'id': 16, 'type': 'expense', 'parent': { 'id': 7 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMIJgCRyokat4tgQ7mpZD1ulYnVkCBg\/BEYcetZSiQZAWFFfSGL18\/y3L7L0jkBfDHw0VQMBL25XkVsQhI4bfOgsOHmW1v6hTeG8\/H7sm2xSy7xi5pTaSN5TBe4OO1i3fWxlyYjzBs=',
    // 'real': 'wy4ECQMISUyWuNS+965gjv8rLriSRODky4ZidKB6DpHuJsNgUc\/twiJYOp8xzYPF0koBQWZtJeKFpwrgSuUJQRbs4fICVuwLL0Y0O0x+WQ6t\/METsDUUV\/xp4fUartMhQpN+ZfrMzyPUDQMBsNtVfdq+rrkqMsmIh8wcAg==',
    'monthlyRealValues': [],
  }, {
    'id': 416,
    'category': { 'id': 17, 'type': 'expense', 'parent': { 'id': 7 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMI1Y6HpQR9iqVgoBs2uzPHLGsh24hkzsSfQcp4pDz9Z3t9gFUsTxLvbN1e0jkBUkGUioxWFUimiSk1\/49YSy\/GT3bjCvzc85eeoJTvMVDVtpTTXrsW7ntSXFpH2TVGxpqgofYB8pw=',
    // 'real': 'wy4ECQMIOtiV4jR884lgdrdo9gWqaokXfSjpZj4RkjOR3UMXBW\/QUN4p5K9fvFlx0j4B8zNwdHSQUV4ekg0sDrRHyAeDQwI0+vMvFdgjeCYjqgsdNPVKUPjyZzQyF2GdGoIAPXJgh3EX7n3XGGXt+g==',
    'monthlyRealValues': [],
  }, {
    'id': 419,
    'category': { 'id': 20, 'type': 'expense', 'parent': { 'id': 8 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMIaQ\/\/HOFFY+1gx7IIYP2o1R8sgOjS5T28G9FVjj2fAxuKSjLN5omqJE2O0jkBZ2Ehy4kotWmojI6uqZMfzJTey6WUMVgNcXts+KyUCKu7sigIqFa\/G\/REhrqfx21RywMKJZDCoE8=',
    // 'real': 'wy4ECQMI1r9ttFxIqqJgI8I6Cpg9M\/YX1G0HTr\/4nElMZROw+paE2c6Pwn9TKgt10j4BVCG2RPOp5iTbya4ybescvwPEXGe3ftaW9jiUZ4PB0eomy\/tmk5aTHiE\/eJD6ay70Hu7Amid2FRvfumiY0g==',
    'monthlyRealValues': [],
  }, {
    'id': 420,
    'category': { 'id': 21, 'type': 'expense', 'parent': { 'id': 8 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMIcuSneK7qfXZgwrqxBk344avpH5ZS\/gsEliZSaj1LOgMWXrfbx+0Fspdw0jkBFqFmFywG8VkyNybPnLuMnDdrh2dVNf1oI+I\/x4ZIlS2rmVOfGg2DWE6cUPctS9o0q+SzVOp8QwY=',
    // 'real': 'wy4ECQMIK92wgPfBu0tg+NCkTOYhln9Iigo7wYgneopcOor\/ffbZSKUwXTH\/Ybcp0j4BwjG5+A8x9NE\/wnapbSDivfIbQ1Fvuk1ERJ2usZe1ezatVPZFwg9ELCGfmXy56hDpTZOF2l9uKdrVu+OckQ==',
    'monthlyRealValues': [],
  }, {
    'id': 425,
    'category': { 'id': 25, 'type': 'expense', 'parent': { 'id': 9 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMIFJFw72K7\/yxgh92vxDLd3ccxobnX2onBUWM2ScvngjinHkeEbUL3YaFY0jkBnWgqmN5Y2QcOdzbELGw69vBWaG0FYM0IyDFuS2srOWAVGTWVwghXcQmr6srcV55VwuZswhNFPfQ=',
    // 'real': 'wy4ECQMIsI5RVsA8GhdgUgSCJPuz8OED0dg38hriKMVhL9FLGsFptqDZ\/KE+8zuI0jsBiwkmgkXZTKyhJpxpZGzvNHAkeNgUTCeMwxgJcVH\/ZNa5uAtKyFebDzwTyjP7nK8ujMzU9QU1KQG5cw==',
    'monthlyRealValues': [],
  }, {
    'id': 426,
    'category': { 'id': 24, 'type': 'expense', 'parent': { 'id': 9 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': 'wy4ECQMI+LLtGusJccVgrU8lPp802QgyVIIV9QhLJeGbjLkg4cMg0H\/uJrcQonp40jkBQ94+7WwZUvBFf6XrktXAkvTKij9FNPsFQRKwxSY6VfI3N8acTTrVn7+RHdlJd\/CjwfmE+iELko0=',
    // 'real': 'wy4ECQMI6yC7egrdxc5gytBzHWUxgKLtZWQRZrowDt8sSgvrZ6H\/\/d\/iZf0qujXR0j4BmshZoFvaR52C6\/lugVSzVof3xHyuHzxvv0LQy9nxBfPtXtYv5hqAlGgpPZTFAqWuJQpwU7\/\/p22UhtfCVg==',
    'monthlyRealValues': [],
  }, {
    'id': 599,
    'category': { 'id': 22, 'type': 'expense', 'parent': { 'id': 8 } },
    'month': 1,
    'plan': 100,
    'real': 98,
    // 'plan': '',
    // 'real': 'wy4ECQMIAGI4o1+698tg2wxf1Yom9gYHH7lysvXAhMHxPEaZP0ge89puZbY2UhTV0joB2ompa8RJbyzzTkoqcbf\/2CGtYpofBWe\/oLJV6gFf3sv1pT9\/q38SYDSFoHeuNDiULxjZ9dFzVnqv',
    'monthlyRealValues': [],
  },
] as BudgetEntry[]

export class BudgetEntryService {
  static loadFromCache = async (request: Request): Promise<AppAction> => {
    const cached = await caches.match(request)

    if (cached) {
      const response = cached.clone()
      const entries = await response.json() as BudgetEntry[]

      return updateEntries({
        entries,
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

      const entries = await response.json() as BudgetEntry[]

      return updateEntries({
        entries,
        source: 'network',
      })
    } catch (err) {
      // TODO: Restore error catching
      return new Promise<AppAction>(resolve => {
        setTimeout(() => resolve(updateEntries({
          entries: budgetEntries,
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
