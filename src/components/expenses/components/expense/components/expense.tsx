import React, { FC, Fragment, useCallback, useState } from 'react'
import { Divider, Grid, Responsive, Segment } from 'semantic-ui-react'
import { sum } from 'ramda'

import styles from '../expense.module.css'
import { Receipt, ReceiptItem as ItemType } from '../../../receipt.types'
import { AddReceiptItem, DeleteReceiptItem, UpdateReceiptItem } from '../../../expenses.actions'
import { ReceiptItem } from './receipt-item'
import { NewReceiptItem } from './new-receipt-item'
import { ReceiptControls } from './receipt-controls'
import { ReceiptHeader } from '../../receipt-header'
import { ItemButtons } from './item-buttons'
import { NewItemButtons } from './new-item-buttons'

type ExpenseProps = {
  receipt: Receipt
  items: ItemType[]
  addItem: (item: AddReceiptItem) => void
  updateItem: (item: UpdateReceiptItem) => void
  deleteItem: (item: DeleteReceiptItem) => void
}

const round = (number: number, precision: number) => {
  const p = Math.pow(10, precision)

  return Math.round(number * p) / p
}

export const Expense: FC<ExpenseProps> = React.memo(
  ({ receipt, items, addItem, updateItem, deleteItem }) => {
    const processing = receipt.processing || false
    const [expanded, setExpanded] = useState(receipt.expanded || false)
    const [date, setDate] = useState(receipt.date)
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

    const renderControls = useCallback(() => (
      <ReceiptControls
        item={{ id: receipt.id, date, shop }}
        expanded={expanded}
        processing={processing}
        setExpanded={setExpanded}
      />
    ), [receipt, date, shop, expanded, processing, setExpanded])

    const total = round(sum(items.map(item => item.price)), 2)

    // TODO: Work on expanding speed improvements - it shouldn't take more than 100 ms on a phone!
    return (
      <Grid as={Segment} className={styles.container}>
        <ReceiptHeader date={date.toString()} shop={shop} total={total} onUpdate={update}>
          {renderControls}
        </ReceiptHeader>
        {expanded && (
          <Fragment>
            <NewReceiptItem>
              {renderNewItemButtons}
            </NewReceiptItem>
            {items.length > 0 && <Divider className={styles.divider} />}
            {items.map(item => (
              <ReceiptItem key={item.id} disabled={processing} item={item}>
                {renderItemButtons}
              </ReceiptItem>
            ))}
          </Fragment>
        )}
        <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
          {expanded && <Divider className={styles.innerDivider} />}
          {renderControls()}
        </Responsive>
      </Grid>
    )
  },
)
