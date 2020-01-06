import React, { FC, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Receipt } from '../../../receipt.types'
import { addReceiptItem, deleteReceiptItem, updateReceipt, updateReceiptItem } from '../../../expenses.actions'
import { ReceiptControls } from './receipt-controls'
import { Expense } from './expense'
import { createExpenseItemsSelector } from '../../../expenses.selectors'

type SavedExpenseProps = {
  receipt: Receipt
}

export const SavedExpense: FC<SavedExpenseProps> = ({ receipt }) => {
  const dispatch = useDispatch()
  const itemsSelector = useMemo(() => createExpenseItemsSelector(receipt.id), [receipt])

  const onSave = useCallback((receipt) => dispatch(updateReceipt(receipt)), [dispatch])
  const addItem = useCallback((item) => dispatch(addReceiptItem(item)), [dispatch])
  const updateItem = useCallback((item) => dispatch(updateReceiptItem(item)), [dispatch])
  const deleteItem = useCallback((item) => dispatch(deleteReceiptItem(item)), [dispatch])
  const items = useSelector(itemsSelector)

  const [expanded, setExpanded] = useState(receipt.expanded || false)
  const renderControls = useCallback((date?: number, shop?: string) => (
    <ReceiptControls
      item={{ id: receipt.id, day: date || new Date().getDate(), shop }}
      expanded={expanded}
      processing={receipt.processing || false}
      setExpanded={setExpanded}
    />
  ), [receipt, expanded, setExpanded])

  return (
    <Expense
      expanded={expanded}
      receipt={receipt}
      items={items}
      onSave={onSave}
      addItem={addItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
    >
      {renderControls}
    </Expense>
  )
}
