import React, { FC, useCallback, useState } from 'react'

import { ReceiptItem } from '../../receipt-item'
import { NewReceiptItem as NewItemType } from '../../../receipt.types'
import { ExpenseFields, FocusableExpenseFields } from '../expense.types'

type NewReceiptItemProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  children: (category: number, value: number, description: string, reset: () => void) => JSX.Element
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent) => void
  onSave: (item: NewItemType) => void
}

export const NewReceiptItem: FC<NewReceiptItemProps> = ({ addField, children, onKeyDown, onSave }) => {
  const [category, setCategory] = useState<number | string>('')
  const [value, setValue] = useState<number | string>('')
  const [description, setDescription] = useState<string>('')

  const reset = useCallback(() => {
    setCategory('')
    setValue(0)
    setDescription('')
  }, [])
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
  const handleKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSave({
        value: value as number, // TODO: Fix number type cast
        category: { id: category as number }, // TODO: Fix number type cast
        description: description,
      })
      reset()
    }
    if (onKeyDown) {
      onKeyDown(field, event)
    }
  }, [onKeyDown, onSave, reset, category, value, description])

  // TODO: Fix number type cast
  return (
    <ReceiptItem
      category={category}
      description={description}
      disabled={false}
      value={value}
      onUpdate={update}
      addField={addField}
      onKeyDown={handleKeyDown}
    >
      {children(category as number, value as number, description, reset)}
    </ReceiptItem>
  )
}
