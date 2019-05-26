import React, { FC, useCallback, useState } from 'react'
import { ReceiptItem } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt.types'

type NewReceiptItemProps = {
  children: (item: ItemType, reset: () => void) => JSX.Element
}

const emptyItem = (): ItemType => ({
  id: Date.now(),
  description: '',
  category: '',
  price: 0,
})

export const NewReceiptItem: FC<NewReceiptItemProps> = React.memo(
  ({ children }) => {
    const [item, setItem] = useState<ItemType>(emptyItem())

    const reset = useCallback(() => setItem(emptyItem()), [setItem])
    const update = useCallback((field, value) => {
      // @ts-ignore
      item[field] = value
    }, [item])

    return (
      <ReceiptItem
        key={item.id}
        category={item.category}
        description={item.description}
        price={item.price}
        onUpdate={update}
      >
        {children(item, reset)}
      </ReceiptItem>
    )
  },
)
