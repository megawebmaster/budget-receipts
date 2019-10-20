import React, { FC, useCallback, useState } from 'react'
import { ReceiptItem } from '../../receipt-item'
import { NewReceiptItem as ItemType } from '../../../receipt.types'

type NewReceiptItemProps = {
  onSave: (item: ItemType) => void
  children: (item: ItemType, reset: () => void) => JSX.Element
}

const emptyItem = (): ItemType => ({
  id: Date.now(),
  description: '',
  category: undefined,
  price: undefined,
})

export const NewReceiptItem: FC<NewReceiptItemProps> = React.memo(
  ({ onSave, children }) => {
    const [item, setItem] = useState<ItemType>(emptyItem())

    const reset = useCallback(() => setItem(emptyItem()), [setItem])
    const update = useCallback((field, value) => {
      // @ts-ignore
      item[field] = value
    }, [item])
    const save = useCallback(() => {
      onSave(item)
      reset()
    }, [onSave, reset, item])

    return (
      <ReceiptItem
        key={item.id}
        category={item.category}
        description={item.description}
        disabled={false}
        price={item.price}
        onUpdate={update}
        onSave={save}
      >
        {children(item, reset)}
      </ReceiptItem>
    )
  },
)
