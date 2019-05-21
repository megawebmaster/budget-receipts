import React, { FC, useState } from 'react'
import { ReceiptItem } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt'

type NewReceiptItemProps = {
  children: (item: ItemType, reset: () => void) => JSX.Element
}

const emptyItem = (): ItemType => ({
  id: Date.now(),
  description: '',
  category: '',
  price: 0,
})

export const NewReceiptItem: FC<NewReceiptItemProps> = ({ children }) => {
  const [item, setItem] = useState<ItemType>(emptyItem())

  return (
    <ReceiptItem
      key={item.id}
      category={item.category}
      description={item.description}
      price={item.price}
      onUpdate={(field, value) => {
        item[field] = value
      }}
    >
      {children(item, () => setItem(emptyItem()))}
    </ReceiptItem>
  )
}
