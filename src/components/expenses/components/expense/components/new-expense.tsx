import React, { Fragment, useCallback, useState } from 'react'
import { Button, ButtonGroup, Responsive } from 'semantic-ui-react'
import { Receipt, ReceiptItem as Item } from '../../../receipt.types'
import { PhotoButton } from './photo-button'
import { Expense } from './expense'
import { addReceipt, AddReceiptItem, DeleteReceiptItem, UpdateReceiptItem } from '../../../expenses.actions'
import { useDispatch } from 'react-redux'

const emptyReceipt = (): Receipt => ({
  id: Date.now(),
  day: new Date().getDate(),
  shop: '',
  expanded: true,
})

// TODO: Make using it a pleasure - proper focus moving etc
export const NewExpense = () => {
  const dispatch = useDispatch()

  const [receipt, setReceipt] = useState<Receipt>(emptyReceipt())
  const [items, setItems] = useState<Item[]>([])

  const addItem = useCallback((item: AddReceiptItem) => {
    setItems(items => [...items, item.value])
  }, [setItems])

  const updateItem = useCallback((item: UpdateReceiptItem) => {
    setItems(items => items.map(currentItem => currentItem.id === item.itemId ? item.value : currentItem))
  }, [setItems])

  const deleteItem = useCallback((item: DeleteReceiptItem) => {
    setItems(items => items.filter(currentItem => currentItem.id !== item.itemId))
  }, [setItems])

  const reset = useCallback(() => {
    setReceipt(emptyReceipt())
    setItems([])
  }, [setReceipt, setItems])
  const saveReceipt = useCallback((receipt) => {
    console.log('receipt', receipt)
    dispatch(addReceipt({ receipt: { ...receipt, expanded: false }, items }))
    reset()
  }, [dispatch, reset, items])

  const renderControls = useCallback((date, shop) => {
    const onSave = () => saveReceipt({ ...receipt, date, shop })
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
      expanded={true}
      receipt={receipt}
      items={items}
      onSave={saveReceipt}
      addItem={addItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
    >
      {renderControls}
    </Expense>
  )
}
