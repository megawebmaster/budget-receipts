import { ParsingMessage, ParsingResultItem } from './receipt.types'

export function ParsingWorker(this: Worker) {
  this.onmessage = function (event: MessageEvent) {
    const data = event.data as ParsingResultItem[]

    data.forEach(item => {
      // TODO: Make it parse!
      let description = item.description
      if (item.supplementaryLineItems) {
        if (item.supplementaryLineItems.above.length > 0) {
          description = item.supplementaryLineItems.above[0].description
        }
        // if (item.supplementaryLineItems.below.length > 0) {
        //   description = item.supplementaryLineItems.below[0].description
        // }
      }
      this.postMessage({
        type: 'item',
        value: {
          price: item.total,
          description,
          category: 'c1',
        },
      } as ParsingMessage)
    })

    this.postMessage({ type: 'done' } as ParsingMessage)
  }
}
