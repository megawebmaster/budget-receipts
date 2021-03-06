import { ProcessingMessage, ProcessRequestMessage } from './receipt.types'

export function ParsingWorker(this: Worker) {
  // TODO: Fetch data required to process information
  this.onmessage = function (event: MessageEvent) {
    const data = event.data as ProcessRequestMessage

    data.items.forEach(item => {
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
        id: data.id,
        value: {
          description,
          categoryId: 1,
          value: item.total,
        },
      } as ProcessingMessage)
    })

    this.postMessage({ type: 'done', id: data.id } as ProcessingMessage)
  }
}
