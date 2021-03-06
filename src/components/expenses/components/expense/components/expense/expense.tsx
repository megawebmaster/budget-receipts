import React, { FC, Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { Divider, Grid, Segment } from 'semantic-ui-react'
import { sum } from 'ramda'
import cx from 'classnames'

import {
  NewReceiptItem as NewItemType,
  Receipt,
  ReceiptItem as ItemType,
  ReceiptItem,
  ReceiptUpdateFields,
} from '../../../../receipt.types'
import { DeleteReceiptItem, UpdateReceiptItem } from '../../../../expenses.actions'
import { SavedReceiptItem } from './saved-receipt-item'
import { NewReceiptItem } from './new-receipt-item'
import { ReceiptHeader } from '../../../receipt-header'
import { ItemButtons } from '../item-buttons'
import { NewItemButtons } from '../new-item-buttons'
import { ExpenseFields, FocusableExpenseFields, ReceiptFields } from '../../expense.types'

import styles from '../../expense.module.css'

type ExpenseProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  addItem: (item: NewItemType) => void
  children: (day?: number, shop?: string) => ReactNode
  deleteItem: (item: DeleteReceiptItem) => void
  expanded: boolean
  items: ItemType[]
  onBlur?: (field: ReceiptFields, value: any) => void
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent, value: any) => void
  onSave: (values: ReceiptUpdateFields) => void
  receipt: Receipt
  updateItem: (item: UpdateReceiptItem) => void
}

const round = (number: number, precision: number) => {
  const p = Math.pow(10, precision)

  return Math.round(number * p) / p
}

export const Expense: FC<ExpenseProps> =
  ({ addField, addItem, children, deleteItem, expanded, items, onBlur, onKeyDown, onSave, receipt, updateItem }) => {
    const processing = receipt.processing || false
    const [day, setDay] = useState(receipt.day)
    const [shop, setShop] = useState(receipt.shop)

    const update = useCallback((field: ReceiptFields, value: any) => {
      switch (field) {
        case 'day':
          return setDay(value)
        case 'shop':
          return setShop(value)
        default:
          throw new Error(`Invalid field passed to ReceiptHeader update: ${field}`)
      }
    }, [])

    const renderItemButtons = useCallback((itemId: ReceiptItem['id']) => (
      <ItemButtons receipt={receipt} itemId={itemId} deleteItem={deleteItem} />
    ), [receipt, deleteItem])

    const renderNewItemButtons = useCallback((categoryId: number, value: number, description: string, reset) => (
      <NewItemButtons
        item={{ categoryId, value, description }}
        reset={reset}
        addItem={addItem}
      />
    ), [addItem])

    const updateExistingItem = useCallback((item) => (
      updateItem({ id: receipt.id, itemId: item.id, value: item })
    ), [updateItem, receipt.id])

    const handleKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent, newValue: any) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        const fieldName = ['description', 'category', 'value'].includes(field) ? 'item' : field
        onSave({
          day,
          shop,
          [fieldName]: newValue,
        })
      }
      if (onKeyDown) {
        onKeyDown(field, event, newValue)
      }
    }, [onKeyDown, onSave, day, shop])

    useEffect(() => {
      setDay(receipt.day)
      setShop(receipt.shop)
    }, [receipt])

    const total = round(sum(items.map(item => item.value)), 2)

    // TODO: Work on expanding speed improvements - it shouldn't take more than 100 ms on a phone!
    return (
      <Grid as={Segment} className={cx(styles.container)}>
        <ReceiptHeader
          addField={addField}
          day={day}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          onUpdate={update}
          shop={shop}
          total={total}
        >
          {children}
        </ReceiptHeader>
        {expanded && (
          <Fragment>
            <NewReceiptItem onSave={addItem} addField={addField} onKeyDown={handleKeyDown}>
              {renderNewItemButtons}
            </NewReceiptItem>
            {items.length > 0 && <Divider className={styles.divider} />}
            {items.map(item => (
              <SavedReceiptItem key={item.id} disabled={processing} item={item} onUpdate={updateExistingItem}>
                {renderItemButtons}
              </SavedReceiptItem>
            ))}
          </Fragment>
        )}
        <Grid.Column width={16} className={styles.hideButton}>
          {expanded && <Divider className={styles.innerDivider} />}
          {children(day, shop)}
        </Grid.Column>
      </Grid>
    )
  }
