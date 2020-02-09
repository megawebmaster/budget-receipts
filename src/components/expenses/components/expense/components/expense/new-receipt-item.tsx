import React, { FC, useCallback, useState } from 'react'

import { ReceiptItem } from '../../../receipt-item'
import { NewReceiptItem as NewItemType } from '../../../../receipt.types'
import { ExpenseFields, FocusableExpenseFields } from '../../expense.types'

type NewReceiptItemProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  children: (category: number, value: number, description: string, reset: () => void) => JSX.Element
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent, value: any) => void
  onSave: (item: NewItemType) => void
}

export const NewReceiptItem: FC<NewReceiptItemProps> = ({ addField, children, onKeyDown, onSave }) => {
  const [categoryId, setCategory] = useState<number | string>('')
  const [value, setValue] = useState<number | string>('')
  const [description, setDescription] = useState<string>('')

  const reset = () => {
    setCategory('')
    setValue('')
    setDescription('')
  }
  const update = useCallback((field, value) => {
    switch (field) {
      case 'category':
        setCategory(value)
        break
      case 'value':
        setValue(value)
        break
      case 'description':
        setDescription(value)
    }
  }, [])

  const handleKeyDown = (field: ExpenseFields, event: React.KeyboardEvent, newValue: NewItemType) => {
    if (event.key === 'Enter') {
      onSave(newValue)
      reset()
    }
    if (onKeyDown) {
      onKeyDown(field, event, newValue)
    }
  }

  return (
    <ReceiptItem
      categoryId={categoryId}
      description={description}
      disabled={false}
      value={value}
      onUpdate={update}
      addField={addField}
      onKeyDown={handleKeyDown}
    >
      {children(categoryId as number, value as number, description, reset)}
    </ReceiptItem>
  )
}
