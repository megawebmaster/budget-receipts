import React, { FC, useCallback, useState } from 'react'
import { ReceiptItem } from '../../receipt-item'
import { ReceiptItem as ItemType } from '../../../receipt.types'
import { ExpenseFields } from '../expense.types'

type ReceiptItemProps = {
  children: (item: ItemType) => JSX.Element
  disabled: boolean
  item: ItemType
  onUpdate: (item: ItemType) => void
}

export const SavedReceiptItem: FC<ReceiptItemProps> = ({ children, disabled, item, onUpdate }) => {
  const [category, setCategory] = useState(item.category.id)
  const [description, setDescription] = useState(item.description)
  const [value, setValue] = useState<number>(item.value)

  const update = useCallback((field, value) => {
    switch (field) {
      case 'category':
        return setCategory(value)
      case 'description':
        return setDescription(value)
      case 'value':
        return setValue(value)
      default:
        throw new Error(`Invalid field passed to ReceiptItem update: ${field}`)
    }
  }, [])

  const onKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onUpdate({
        ...item,
        description,
        category: { id: category },
        value: value,
      })
    }
  }, [onUpdate, item, description, category, value])

  return (
    <ReceiptItem
      category={category}
      disabled={disabled}
      description={description}
      onKeyDown={onKeyDown}
      onUpdate={update}
      value={value}
    >
      {children({ description, value, category: { id: category }, id: item.id, receiptId: item.receiptId })}
    </ReceiptItem>
  )
}
