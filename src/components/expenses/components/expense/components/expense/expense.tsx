import React, { FC, Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { Divider, Grid, Responsive, Segment } from 'semantic-ui-react'
import { sum } from 'ramda'
import cx from 'classnames'

import {
  Receipt,
  ReceiptItem as ItemType,
  NewReceiptItem as NewItemType,
  ReceiptUpdateFields, ReceiptItem,
} from '../../../../receipt.types'
import { DeleteReceiptItem, UpdateReceiptItem } from '../../../../expenses.actions'
import { SavedReceiptItem } from '../saved-receipt-item'
import { NewReceiptItem } from '../new-receipt-item'
import { ReceiptHeader } from '../../../receipt-header'
import { ItemButtons } from '../item-buttons'
import { NewItemButtons } from '../new-item-buttons'
import { ExpenseFields, FocusableExpenseFields } from '../../expense.types'

import styles from '../../expense.module.css'

type ExpenseProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  addItem: (item: NewItemType) => void
  children: (day?: number, shop?: string) => ReactNode
  deleteItem: (item: DeleteReceiptItem) => void
  expanded: boolean
  items: ItemType[]
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent) => void
  onSave: (values: ReceiptUpdateFields) => void
  receipt: Receipt
  updateItem: (item: UpdateReceiptItem) => void
}

const round = (number: number, precision: number) => {
  const p = Math.pow(10, precision)

  return Math.round(number * p) / p
}

export const Expense: FC<ExpenseProps> =
  ({ addField, addItem, children, deleteItem, expanded, items, onKeyDown, onSave, receipt, updateItem }) => {
    const processing = receipt.processing || false
    const [day, setDay] = useState(receipt.day)
    const [shop, setShop] = useState(receipt.shop)

    const update = useCallback((field: keyof ReceiptUpdateFields, value: any) => {
      switch (field) {
        case 'day':
          return setDay(value)
        case 'shop':
          return setShop(value)
        default:
          throw new Error(`Invalid field passed to ReceiptHeader update: ${field}`)
      }
    }, [])

    const renderItemButtons = useCallback((item: ReceiptItem) => (
      <ItemButtons receipt={receipt} item={item} updateItem={updateItem} deleteItem={deleteItem} />
    ), [receipt, updateItem, deleteItem])

    const renderNewItemButtons = useCallback((category: number, value: number, description: string, reset) => (
      // TODO: Make it easier to work with
      <NewItemButtons
        item={{ category: { id: category }, value, description }}
        reset={reset}
        addItem={addItem}
      />
    ), [addItem])

    const updateExistingItem = useCallback((item) => (
      updateItem({ id: receipt.id, itemId: item.id, value: item })
    ), [updateItem, receipt.id])

    const handleKeyDown = useCallback((field: ExpenseFields, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        onSave({ day, shop })
      }
      if (onKeyDown) {
        onKeyDown(field, event)
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
        <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
          {expanded && <Divider className={styles.innerDivider} />}
          {children(day, shop)}
        </Responsive>
      </Grid>
    )
  }
