import React, { FC, ReactNode, useCallback } from 'react'
import { Grid, Input, Responsive } from 'semantic-ui-react'

import styles from '../receipt-header.module.css'
import { DayField } from './day-field'
import { CurrencyInput } from '../../../../currency-input'
import { ExpenseFields, FocusableExpenseFields, ReceiptFields } from '../../expense/expense.types'

type ReceiptHeaderProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  children: (day?: number, shop?: string) => ReactNode
  day?: number
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent, value: any) => void
  onUpdate: (field: ReceiptFields, value: any) => void
  shop?: string
  total?: number
}

export const ReceiptHeader: FC<ReceiptHeaderProps> = ({ day, shop, total, onUpdate, children, addField, onKeyDown }) => {
  const updateDate = useCallback((day) => onUpdate('day', day), [onUpdate])
  const updateShop = useCallback((event) => onUpdate('shop', event.target.value), [onUpdate])

  const addDayField = useCallback(
    (input: HTMLInputElement | null) => addField && addField('day', input),
    [addField],
  )
  const dayKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown('day', event, event.currentTarget.value),
    [onKeyDown],
  )
  const shopKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown('shop', event, event.currentTarget.value),
    [onKeyDown],
  )

  return (
    <Grid.Row className={styles.header}>
      <Grid.Column mobile={4} tablet={3} computer={3}>
        <DayField
          value={day?.toString() || ''}
          onChange={updateDate}
          addField={addDayField}
          onKeyDown={dayKeyDown}
        />
      </Grid.Column>
      <Grid.Column mobile={6} tablet={4} computer={4}>
        <Input
          fluid
          placeholder="Shop"
          value={shop}
          onChange={updateShop}
          onKeyDown={shopKeyDown}
        />
      </Grid.Column>
      <Grid.Column mobile={6} tablet={5} computer={5}>
        <CurrencyInput
          narrowOnMobile
          className={styles.disabledInput}
          currency="PLN"
          disabled={true}
          placeholder="Total"
          value={total || 0}
        />
      </Grid.Column>
      <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Grid.Column} width={4}>
        {children(day, shop)}
      </Responsive>
    </Grid.Row>
  )
}
