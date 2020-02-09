import React, { FC, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { omit, pick } from 'ramda'

import { NewReceiptItem, Receipt, ReceiptUpdateFields } from '../../../receipt.types'
import {
  addReceiptItem,
  DeleteReceiptItem,
  deleteReceiptItem,
  updateReceipt,
  UpdateReceiptItem,
  updateReceiptItem,
} from '../../../expenses.actions'
import { ReceiptControls } from './receipt-controls'
import { Expense } from './expense'
import { createExpenseItemsSelector } from '../../../expenses.selectors'
import { ExpenseFields, FocusableExpenseFields } from '../expense.types'
import { createItem } from '../expense.helpers'

type SavedExpenseProps = {
  receipt: Receipt
}

export const SavedExpense: FC<SavedExpenseProps> = ({ receipt }) => {
  const dispatch = useDispatch()
  const itemsSelector = useMemo(() => createExpenseItemsSelector(receipt.id), [receipt.id])
  const [fields, setFields] = useState<Record<FocusableExpenseFields, HTMLInputElement | null>>({
    day: null,
    category: null,
  })

  const addField = useCallback((field: FocusableExpenseFields, input: HTMLInputElement | null) => {
    setFields(fields => ({ ...fields, [field]: input }))
  }, [])

  const onSave = useCallback((values: ReceiptUpdateFields) =>
    dispatch(updateReceipt({ ...omit(['items'], receipt), ...pick(['day', 'shop'], values) })),
    [dispatch, receipt],
  )
  const addItem = useCallback(
    (item: NewReceiptItem) => dispatch(addReceiptItem({
      id: receipt.id,
      value: createItem(receipt.id, item),
    })),
    [dispatch, receipt.id],
  )
  const updateItem = useCallback((item: UpdateReceiptItem) => dispatch(updateReceiptItem(item)), [dispatch])
  const deleteItem = useCallback((item: DeleteReceiptItem) => dispatch(deleteReceiptItem(item)), [dispatch])
  const items = useSelector(itemsSelector)

  const onKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      switch (field) {
        case 'categoryId':
        case 'value':
        case 'description':
          setTimeout(() => fields.category !== null && fields.category.focus(), 0)
          break
      }
    }
  }, [fields])

  const [expanded, setExpanded] = useState(receipt.expanded || false)
  const renderControls = useCallback((day?: number, shop?: string) => (
    <ReceiptControls
      item={{ id: receipt.id, day: day || new Date().getDate(), shop }}
      expanded={expanded}
      processing={receipt.processing || false}
      setExpanded={setExpanded}
    />
  ), [receipt.id, receipt.processing, expanded])

  return (
    <Expense
      addField={addField}
      addItem={addItem}
      deleteItem={deleteItem}
      expanded={expanded}
      items={items}
      receipt={receipt}
      onKeyDown={onKeyDown}
      onSave={onSave}
      updateItem={updateItem}
    >
      {renderControls}
    </Expense>
  )
}
