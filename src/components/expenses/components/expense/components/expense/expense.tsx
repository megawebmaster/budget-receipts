import React, { FC, Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { Divider, Grid, Responsive, Segment } from 'semantic-ui-react'
import { sum } from 'ramda'
import cx from 'classnames'

import styles from '../../expense.module.css'
import { Receipt, ReceiptItem as ItemType } from '../../../../receipt.types'
import { AddReceiptItem, DeleteReceiptItem, UpdateReceiptItem } from '../../../../expenses.actions'
import { ReceiptItem } from '../receipt-item'
import { NewReceiptItem } from '../new-receipt-item'
import { ReceiptHeader } from '../../../receipt-header'
import { ItemButtons } from '../item-buttons'
import { NewItemButtons } from '../new-item-buttons'

type ExpenseProps = {
  receipt: Receipt
  items: ItemType[]
  expanded: boolean
  onSave: (receipt: Receipt) => void
  addItem: (item: AddReceiptItem) => void
  updateItem: (item: UpdateReceiptItem) => void
  deleteItem: (item: DeleteReceiptItem) => void
  children: (date?: number, shop?: string) => ReactNode
}

const round = (number: number, precision: number) => {
  const p = Math.pow(10, precision)

  return Math.round(number * p) / p
}

export const Expense: FC<ExpenseProps> =
  ({ children, expanded, receipt, items, onSave, addItem, updateItem, deleteItem }) => {
    const processing = receipt.processing || false
    const [date, setDate] = useState(receipt.day)
    const [shop, setShop] = useState(receipt.shop)

    const update = useCallback((field, value) => {
      switch (field) {
        case 'date':
          return setDate(value)
        case 'shop':
          return setShop(value)
        default:
          throw new Error(`Invalid field passed to ReceiptHeader update: ${field}`)
      }
    }, [setDate, setShop])

    const renderItemButtons = useCallback((item) => (
      <ItemButtons receipt={receipt} item={item} updateItem={updateItem} deleteItem={deleteItem} />
    ), [receipt, updateItem, deleteItem])

    const renderNewItemButtons = useCallback((item, reset) => (
      <NewItemButtons receipt={receipt} item={item} reset={reset} addItem={addItem} />
    ), [receipt, addItem])

    const addNewItem = useCallback((item) => (
      addItem({ id: receipt.id, value: item })
    ), [addItem, receipt])
    const updateExistingItem = useCallback((item) => (
      updateItem({ id: receipt.id, itemId: item.id, value: item })
    ), [updateItem, receipt])

    const save = useCallback((date, shop) => {
      onSave({
        ...receipt,
        day: date,
        shop,
      })
    }, [onSave, receipt])

    useEffect(() => {
      setDate(receipt.day)
      setShop(receipt.shop)
    }, [receipt, setDate, setShop])

    const total = round(sum(items.map(item => item.value)), 2)

    // TODO: Work on expanding speed improvements - it shouldn't take more than 100 ms on a phone!
    return (
      <Grid as={Segment} className={cx(styles.container)}>
        <ReceiptHeader date={date} shop={shop} total={total} onSave={save} onUpdate={update}>
          {children}
        </ReceiptHeader>
        {expanded && (
          <Fragment>
            <NewReceiptItem onSave={addNewItem}>
              {renderNewItemButtons}
            </NewReceiptItem>
            {items.length > 0 && <Divider className={styles.divider} />}
            {items.map(item => (
              <ReceiptItem key={item.id} disabled={processing} item={item} onUpdate={updateExistingItem}>
                {renderItemButtons}
              </ReceiptItem>
            ))}
          </Fragment>
        )}
        <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
          {expanded && <Divider className={styles.innerDivider} />}
          {children(date, shop)}
        </Responsive>
      </Grid>
    )
  }
