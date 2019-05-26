import React, { FC, Fragment, useCallback, useState } from 'react'
import { Button, ButtonGroup, Divider, Grid, Responsive, Segment } from 'semantic-ui-react'
import { sum } from 'ramda'

import styles from '../expense.module.css'
import { Receipt, ReceiptItem as ItemType } from '../../../receipt.types'
import { AddReceiptItem, DeleteReceiptItem, UpdateReceiptItem } from '../../../expenses.actions'
import { ReceiptItem } from './receipt-item'
import { NewReceiptItem } from './new-receipt-item'
import { ReceiptControls } from './receipt-controls'
import { ReceiptHeader } from '../../receipt-header'

type ItemButtonsProps = {
  id: number
  item: ItemType
  updateItem: (item: UpdateReceiptItem) => void
  deleteItem: (item: DeleteReceiptItem) => void
}

const ItemButtons: FC<ItemButtonsProps> = ({ id, item, updateItem, deleteItem }) => {
  const save = useCallback(() => updateItem({ id, itemId: item.id, value: item }), [id, item, updateItem])
  const remove = useCallback(() => deleteItem({ id, itemId: item.id }), [id, item, deleteItem])

  return (
    <ButtonGroup fluid>
      <Button icon="save" color="blue" onClick={save} />
      <Button icon="trash" color="red" onClick={remove} />
    </ButtonGroup>
  )
}

type NewItemButtonsProps = {
  id: number
  item: ItemType
  reset: () => void
  addItem: (item: AddReceiptItem) => void
}

const NewItemButtons: FC<NewItemButtonsProps> = React.memo(
  ({ id, item, reset, addItem }) => (
    <Button fluid icon="plus" color="green" onClick={() => {
      addItem({ id, value: item })
      reset()
    }} />
  ),
)

type ExpenseProps = {
  items: ItemType[]
  addItem: (item: AddReceiptItem) => void
  updateItem: (item: UpdateReceiptItem) => void
  deleteItem: (item: DeleteReceiptItem) => void
} & Receipt

export const Expense: FC<ExpenseProps> = React.memo(
  ({ id, date: originalDate, shop: originalShop, items, addItem, updateItem, deleteItem }) => {
    const [expanded, setExpanded] = useState(false)
    const [date, setDate] = useState(originalDate)
    const [shop, setShop] = useState(originalShop)

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
      <ItemButtons id={id} item={item} updateItem={updateItem} deleteItem={deleteItem} />
    ), [id, updateItem, deleteItem])

    const renderNewItemButtons = useCallback((item, reset) => (
      <NewItemButtons id={id} item={item} reset={reset} addItem={addItem} />
    ), [id, addItem])

    const renderControls = useCallback(() => (
      <ReceiptControls item={{ id, date, shop }} expanded={expanded} setExpanded={setExpanded} />
    ), [id, date, shop, expanded, setExpanded])

    return (
      <Grid as={Segment} className={styles.container}>
        <ReceiptHeader date={date.toString()} shop={shop} total={sum(items.map(item => item.price))} onUpdate={update}>
          {renderControls}
        </ReceiptHeader>
        {expanded && (
          <Fragment>
            {items.map(item => (
              <ReceiptItem key={item.id} item={item}>
                {renderItemButtons}
              </ReceiptItem>
            ))}
            {items.length > 0 && <Divider className={styles.divider} />}
            <NewReceiptItem>
              {renderNewItemButtons}
            </NewReceiptItem>
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
