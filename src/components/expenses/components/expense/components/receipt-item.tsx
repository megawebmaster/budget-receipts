import React, { FC, useState } from 'react'
import { ReceiptItem as ReceiptItemComponent } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt.types'

type ReceiptItemProps = {
  item: ItemType
  children: (item: ItemType) => JSX.Element
}

export const ReceiptItem: FC<ReceiptItemProps> = ({ item, children }) => {
  const [receiptItem] = useState<ItemType>(item)

  return (
    <ReceiptItemComponent
      category={receiptItem.category}
      description={receiptItem.description}
      price={receiptItem.price}
      onUpdate={(field, value) => {
        receiptItem[field] = value
      }}
    >
      {children(receiptItem)}
    </ReceiptItemComponent>
  )
}
