import React, { Fragment, useCallback, useState } from 'react'
import { Button, ButtonGroup, Responsive } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { pick } from 'ramda'

import { NewReceiptItem, Receipt, ReceiptItem, ReceiptUpdateFields } from '../../../receipt.types'
import { PhotoButton } from './photo-button'
import { Expense } from './expense'
import { addReceipt, DeleteReceiptItem, UpdateReceiptItem } from '../../../expenses.actions'
import { ExpenseFields, FocusableExpenseFields } from '../expense.types'
import { createItem } from '../expense.helpers'

const emptyReceipt = (): Receipt => ({
  id: Date.now(),
  day: new Date().getDate(),
  shop: '',
  expanded: true,
})

export const NewExpense = () => {
  const dispatch = useDispatch()

  const [receipt, setReceipt] = useState<Receipt>(emptyReceipt())
  const [items, setItems] = useState<ReceiptItem[]>([])
  const [fields, setFields] = useState<Record<FocusableExpenseFields, HTMLInputElement | null>>({
    day: null,
    category: null,
  })

  const addField = useCallback((field: FocusableExpenseFields, input: HTMLInputElement | null) => {
    setFields(fields => ({ ...fields, [field]: input }))
  }, [])

  const addItem = useCallback((item: NewReceiptItem) => {
    setItems(items => [createItem(receipt.id, item), ...items])
  }, [receipt.id])

  const updateItem = useCallback((item: UpdateReceiptItem) => {
    setItems(items => items.map(currentItem =>
      currentItem.id === item.itemId ? { ...currentItem, ...item.value } : currentItem
    ))
  }, [])

  const deleteItem = useCallback((item: DeleteReceiptItem) => {
    setItems(items => items.filter(currentItem => currentItem.id !== item.itemId))
  }, [])

  const saveReceipt = useCallback((values: ReceiptUpdateFields) => {
    dispatch(addReceipt({
      items: values.item ? [createItem(receipt.id, values.item), ...items] : items,
      receipt: {
        ...receipt,
        ...pick(['day', 'shop'], values),
        expanded: false
      }
    }))
    setReceipt(emptyReceipt())
    setItems([])
  }, [dispatch, items, receipt])

  const onKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        switch (field) {
          case 'categoryId':
          case 'day':
          case 'shop':
          case 'value':
          case 'description':
            if (event.ctrlKey) {
              setTimeout(() => fields.day !== null && fields.day.focus(), 0)
            } else {
              setTimeout(() => fields.category !== null && fields.category.focus(), 0)
            }
            break
        }
        break
      case 'Escape':
        switch (field) {
          case 'value':
          case 'description':
            setTimeout(() => fields.day !== null && fields.day.focus(), 0)
            break
        }
        break
    }
  }, [fields])

  const renderControls = useCallback((day, shop) => {
    const onSave = () => saveReceipt({ ...receipt, day, shop })
    return (
      <Fragment>
        <Responsive maxWidth={Responsive.onlyTablet.maxWidth} as={ButtonGroup} fluid>
          <PhotoButton />
          <Button.Or />
          <Button color="green" icon="plus" tabIndex={-1} onClick={onSave} />
        </Responsive>
        <Responsive
          {...Responsive.onlyComputer}
          as={Button}
          fluid
          color="green"
          icon="plus"
          tabIndex={-1}
          onClick={onSave} />
      </Fragment>
    )
  }, [saveReceipt, receipt])

  return (
    <Expense
      addField={addField}
      addItem={addItem}
      deleteItem={deleteItem}
      expanded={true}
      items={items}
      receipt={receipt}
      onKeyDown={onKeyDown}
      onSave={saveReceipt}
      updateItem={updateItem}
    >
      {renderControls}
    </Expense>
  )
}
