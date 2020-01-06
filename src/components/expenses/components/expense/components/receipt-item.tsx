import React, { FC, useCallback, useState } from 'react'
import { ReceiptItem as ReceiptItemComponent } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt.types'

type ReceiptItemProps = {
  disabled: boolean
  item: ItemType
  onUpdate: (item: ItemType) => void
  children: (item: ItemType) => JSX.Element
}

export const ReceiptItem: FC<ReceiptItemProps> = React.memo(
  ({ disabled, item, onUpdate, children }) => {
    const [category, setCategory] = useState(item.category.id)
    const [description, setDescription] = useState(item.description)
    const [price, setPrice] = useState<number>(item.value)

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

    const updateItem = useCallback((category, description, price) => {
      onUpdate({
        ...item,
        category,
        description,
        value: price
      })
    }, [onUpdate, item])

    return (
      <ReceiptItemComponent
        category={category}
        disabled={disabled}
        description={description}
        price={price}
        onUpdate={update}
        onSave={updateItem}
      >
        {children({ category: { id: category }, description, id: item.id, receiptId: item.receiptId, value: price })}
      </ReceiptItemComponent>
    )
  },
)
