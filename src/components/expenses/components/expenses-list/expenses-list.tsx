import React, { FC, Fragment, useCallback } from 'react'
import { Button, ButtonGroup, Grid, Responsive, Segment } from 'semantic-ui-react'
import { ReceiptHeader } from '../receipt-header'

import styles from './expenses-list.module.css'
import { Expense } from '../expense'
import { Receipt } from '../../receipt.types'

type ExpensesListProps = {
  receipts: Receipt[]
}

// TODO: Add support for manually adding receipts
// TODO: Add support for taking photos
export const ExpensesList: FC<ExpensesListProps> = React.memo(
  ({ receipts }) => {
    const renderControls = useCallback(() => (
      <ButtonGroup fluid>
        <Button color="blue" icon="photo" />
        <Button.Or />
        <Button color="green" icon="plus" />
      </ButtonGroup>
    ), [])

    return (
      <Fragment>
        {receipts.map(receipt => (
          <Expense key={receipt.id} id={receipt.id} date={receipt.date} shop={receipt.shop} />
        ))}
        <Grid as={Segment} className={styles.container}>
          <ReceiptHeader>
            {renderControls}
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
    )
  },
)
