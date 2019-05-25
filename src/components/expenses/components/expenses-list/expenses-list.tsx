import React, { FC, Fragment } from 'react'
import { Button, ButtonGroup, Grid, Responsive, Segment } from 'semantic-ui-react'
import { ReceiptHeader } from '../receipt-header'

import styles from './expenses-list.module.css'
import { Expense } from '../expense'
import { Receipt } from '../../receipt.types'

type ExpensesListProps = {
  receipts: Receipt[]
}

export const ExpensesList: FC<ExpensesListProps> = React.memo(
  ({ receipts }) => (
    <Fragment>
      {receipts.map(receipt => (
        <Expense key={receipt.id} id={receipt.id} date={receipt.date} shop={receipt.shop} />
      ))}
      <Grid as={Segment} className={styles.container}>
        <ReceiptHeader>
          <ButtonGroup fluid>
            <Button color="blue" icon="photo" />
            <Button.Or />
            <Button color="green" icon="plus" />
          </ButtonGroup>
        </ReceiptHeader>
        <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
          <ButtonGroup fluid>
            <Button color="blue" icon="photo" />
            <Button.Or />
            <Button color="green" icon="plus" />
          </ButtonGroup>
        </Responsive>
      </Grid>
    </Fragment>
  ),
)
