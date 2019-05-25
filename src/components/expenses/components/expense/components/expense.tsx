import React, { FC, Fragment, useState } from 'react'
import { Button, ButtonGroup, Divider, Grid, Responsive, Segment } from 'semantic-ui-react'
import { sum } from 'ramda'
import cx from 'classnames'

import { ReceiptHeader } from '../../receipt-header'
import styles from '../expense.module.css'
import { Receipt, ReceiptItem as ItemType } from '../../../receipt.types'
import { AddReceiptItem, DeleteReceiptItem, UpdateReceiptItem } from '../../../expenses.actions'
import { ReceiptItem } from './receipt-item'
import { NewReceiptItem } from './new-receipt-item'

type ExpandButtonProps = {
  expanded: boolean,
  setExpanded: (value: boolean) => void,
}

const ExpandButton: FC<ExpandButtonProps> = React.memo(
  ({ expanded, setExpanded }) => (
    <Button fluid icon={cx('arrow', { up: expanded, down: !expanded })} onClick={() => setExpanded(!expanded)} />
  ),
)

const CreateButton = React.memo(
  () => (
    <ButtonGroup fluid>
      <Button color="blue" icon="photo" />
      <Button.Or />
      <Button color="green" icon="plus" />
    </ButtonGroup>
  ),
)

type ExpenseProps = {
  items: ItemType[],
  addItem: (item: AddReceiptItem) => void
  updateItem: (item: UpdateReceiptItem) => void
  deleteItem: (item: DeleteReceiptItem) => void
} & Receipt

export const Expense: FC<ExpenseProps> = React.memo(
  ({ id, date, shop, items, addItem, updateItem, deleteItem }) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <Grid as={Segment} className={styles.container}>
        <ReceiptHeader date={date.toString()} shop={shop} total={sum(items.map(item => item.price))}>
          {id
            ? (<ExpandButton expanded={expanded} setExpanded={setExpanded} />)
            : (<CreateButton />)}
        </ReceiptHeader>
        {expanded && (
          <Fragment>
            {items.map(item => (
              <ReceiptItem key={item.id} item={item}>
                {(item) => (
                  <ButtonGroup fluid>
                    <Button icon="save" color="blue" onClick={() => updateItem({ id, itemId: item.id, value: item })} />
                    <Button icon="trash" color="red" onClick={() => deleteItem({ id, itemId: item.id })} />
                  </ButtonGroup>
                )}
              </ReceiptItem>
            ))}
            {items.length > 0 && <Divider className={styles.divider} />}
            <NewReceiptItem>
              {(item, reset) => (
                <Button fluid icon="plus" color="green" onClick={() => {
                  addItem({ id, value: item })
                  reset()
                }} />
              )}
            </NewReceiptItem>
          </Fragment>
        )}
        <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
          {id
            ? (<ExpandButton expanded={expanded} setExpanded={setExpanded} />)
            : (<CreateButton />)
          }
        </Responsive>
      </Grid>
    )
  },
)
