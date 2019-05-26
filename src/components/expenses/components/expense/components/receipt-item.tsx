import React, { FC, useCallback, useState } from 'react'
import { ReceiptItem as ReceiptItemComponent } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt.types'

type ReceiptItemProps = {
  item: ItemType
  children: (item: ItemType) => JSX.Element
}

export const ReceiptItem: FC<ReceiptItemProps> = React.memo(
  ({ item, children }) => {
    const [category, setCategory] = useState(item.category)
    const [description, setDescription] = useState(item.description)
    const [price, setPrice] = useState<number>(item.price)

    const update = useCallback((field, value) => {
      switch(field) {
        case 'category':
          return setCategory(value)
        case 'description':
          return setDescription(value)
        case 'price':
          return setPrice(value)
        default:
          throw new Error(`Invalid field passed to ReceiptItem update: ${field}`)
      }
    }, [setCategory, setDescription, setPrice])

    return (
      <ReceiptItemComponent
        category={category}
        description={description}
        price={price}
        onUpdate={update}
      >
        {children({ id: item.id, category, description, price })}
      </ReceiptItemComponent>
    )
  },
)
