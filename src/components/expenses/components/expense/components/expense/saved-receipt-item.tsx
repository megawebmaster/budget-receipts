import React, { FC, useCallback, useState } from 'react'

import { ReceiptItem } from '../../../receipt-item'
import { ChangeReceiptItem, ReceiptItem as ItemType } from '../../../../receipt.types'
import { ExpenseFields, ReceiptItemFields } from '../../expense.types'

type ReceiptItemProps = {
  children: (itemId: ItemType['id'], item: ChangeReceiptItem) => JSX.Element
  disabled: boolean
  item: ItemType
  onUpdate: (item: ItemType) => void
}

export const SavedReceiptItem: FC<ReceiptItemProps> = ({ children, disabled, item, onUpdate }) => {
  const [categoryId, setCategory] = useState(item.categoryId)
  const [description, setDescription] = useState(item.description)
  const [value, setValue] = useState<number>(item.value)

  const update = useCallback((field: ReceiptItemFields, value: any) => {
    switch (field) {
      case 'categoryId':
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
        categoryId,
        description,
        value,
      })
    }
  }, [onUpdate, item, description, categoryId, value])

  const onBlur = useCallback((field: ExpenseFields, newValue: any) => {
    onUpdate({
      ...item,
      categoryId,
      description,
      value,
      [field]: newValue
    })
  }, [onUpdate, item, description, categoryId, value])

  return (
    <ReceiptItem
      categoryId={categoryId}
      disabled={disabled}
      description={description}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onUpdate={update}
      value={value}
    >
      {children(item.id, { description, value, categoryId })}
    </ReceiptItem>
  )
}
