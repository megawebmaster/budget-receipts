import React, { FC, useCallback, useState } from 'react'
import { ReceiptItem as ReceiptItemComponent } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt.types'

type ReceiptItemProps = {
  item: ItemType
  children: (item: ItemType) => JSX.Element
}

// TODO: Figure out a way to use useReducer instead of useState
export const ReceiptItem: FC<ReceiptItemProps> = React.memo(
  ({ item, children }) => {
    const [receiptItem] = useState<ItemType>(item)
    const update = useCallback((field, value) => {
      // @ts-ignore
      receiptItem[field] = value
    }, [receiptItem])

    return (
      <ReceiptItemComponent
        category={receiptItem.category}
        description={receiptItem.description}
        price={receiptItem.price}
        onUpdate={update}
      >
        {children(receiptItem)}
      </ReceiptItemComponent>
    )
  },
)
