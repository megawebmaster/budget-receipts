import React, { Fragment, useCallback, useState } from 'react'
import { Button, ButtonGroup, Responsive } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'

import { NewReceiptItem, Receipt, ReceiptItem, ReceiptUpdateFields } from '../../../receipt.types'
import { PhotoButton } from './photo-button'
import { Expense } from './expense'
import { addReceipt, DeleteReceiptItem, UpdateReceiptItem } from '../../../expenses.actions'
import { ExpenseFields, FocusableExpenseFields } from '../expense.types'

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
    setItems(items => [...items, { ...item, id: Date.now(), receiptId: receipt.id }])
  }, [receipt.id])

  const updateItem = useCallback((item: UpdateReceiptItem) => {
    setItems(items => items.map(currentItem => currentItem.id === item.itemId ? item.value : currentItem))
  }, [])

  const deleteItem = useCallback((item: DeleteReceiptItem) => {
    setItems(items => items.filter(currentItem => currentItem.id !== item.itemId))
  }, [])

  const reset = useCallback(() => {
    setReceipt(emptyReceipt())
    setItems([])
  }, [])

  const saveReceipt = useCallback((values: ReceiptUpdateFields) => {
    dispatch(addReceipt({ receipt: { ...receipt, ...values, expanded: false }, items }))
    reset()
  }, [dispatch, reset, items, receipt])

  const onKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        switch (field) {
          case 'day':
          case 'shop':
          case 'value':
          case 'description':
            if (event.ctrlKey) {
              if (fields.day !== null) {
                fields.day.focus()
              }
            } else if (fields.category !== null) {
              fields.category.focus()
            }
            break
        }
        break
      case 'Escape':
        switch (field) {
          case 'value':
          case 'description':
            if (fields.day !== null) {
              fields.day.focus()
            }
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
          <Button color="green" icon="plus" onClick={onSave} />
        </Responsive>
        <Responsive
          {...Responsive.onlyComputer}
          as={Button}
          fluid
          color="green"
          icon="plus"
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
