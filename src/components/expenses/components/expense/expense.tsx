import React, { FC, useState, Fragment } from "react"
import { Button, ButtonGroup, Divider, Grid, Responsive, Segment } from "semantic-ui-react"
import { sum } from "ramda"
import cx from "classnames"

import { ReceiptHeader } from "../receipt-header"
import { ReceiptItem } from "../receipt-item"
import styles from "./expense.module.css"
import { Receipt, ReceiptItem as ReceiptItemType } from "../../receipt"

type ExpandButtonProps = {
  expanded: boolean,
  setExpanded: (value: boolean) => void,
}

const ExpandButton: FC<ExpandButtonProps> = ({ expanded, setExpanded }) => (
  <Button fluid icon={cx("arrow", { up: expanded, down: !expanded })} onClick={() => setExpanded(!expanded)}/>
)

const CreateButton = () => (
  <ButtonGroup fluid>
    <Button color="blue" icon="photo"/>
    <Button.Or/>
    <Button color="green" icon="plus"/>
  </ButtonGroup>
)

type ExpenseProps = {
  addItem: (item: { id: number, value: ReceiptItemType }) => void,
  deleteItem: (item: { id: number, itemId: number }) => void,
} & Receipt

// TODO: Fix undefined id's issue
export const Expense: FC<ExpenseProps> = ({ id, date, shop, items, addItem, deleteItem }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Grid as={Segment} className={styles.container}>
      <ReceiptHeader date={date.toString()} shop={shop} total={sum(items.map(item => item.price))}>
        {id
          ? (<ExpandButton expanded={expanded} setExpanded={setExpanded}/>)
          : (<CreateButton/>)
        }
      </ReceiptHeader>
      {expanded && (
        <Fragment>
          {items.map(item => (
            <ReceiptItem key={item.id} category={item.category} price={item.price} description={item.description}>
              <Button fluid icon="trash" color="red" onClick={() => deleteItem({ id: id!, itemId: item.id! })}/>
            </ReceiptItem>
          ))}
          {items.length > 0 && <Divider className={styles.divider}/>}
          <ReceiptItem>
            <Button fluid icon="plus" color="green"/>
          </ReceiptItem>
        </Fragment>
      )}
      <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
        {id
          ? (<ExpandButton expanded={expanded} setExpanded={setExpanded}/>)
          : (<CreateButton/>)
        }
      </Responsive>
    </Grid>
  )
}