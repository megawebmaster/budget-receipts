import React, { FC, useCallback } from 'react'
import { Grid, Input, Responsive } from 'semantic-ui-react'

import styles from '../receipt-header.module.css'
import { Receipt } from '../../../receipt.types'
import { DayField } from './day-field'

type ExpensesListHeaderProps = {
  date?: string
  shop?: string
  total?: number
  onUpdate: (field: keyof Receipt, value: any) => void
  children: () => JSX.Element | JSX.Element[]
}

export const ReceiptHeader: FC<ExpensesListHeaderProps> = React.memo(
  ({ date, shop, total, onUpdate, children }) => {
    const updateDate = useCallback((day) => onUpdate('date', day), [onUpdate])
    const updateShop = useCallback((event) => onUpdate('shop', event.target.value), [onUpdate])

    return (
      <Grid.Row className={styles.header}>
        <Grid.Column mobile={4} tablet={3} computer={3}>
          <DayField value={date || ''} onChange={updateDate} />
        </Grid.Column>
        <Grid.Column mobile={6} tablet={4} computer={4}>
          <Input fluid placeholder="Shop" defaultValue={shop} onChange={updateShop} />
        </Grid.Column>
        <Grid.Column mobile={6} tablet={5} computer={5}>
          <Input
            fluid
            disabled
            placeholder="Total"
            labelPosition="right"
            label="PLN"
            value={total}
            className={styles.disabledInput}
          />
        </Grid.Column>
        <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Grid.Column} width={4}>
          {children()}
        </Responsive>
      </Grid.Row>
    )
  },
)
