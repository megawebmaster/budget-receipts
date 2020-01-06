import React, { FC, KeyboardEvent, ReactNode, useCallback } from 'react'
import { Grid, Input, Responsive } from 'semantic-ui-react'

import styles from '../receipt-header.module.css'
import { Receipt } from '../../../receipt.types'
import { DayField } from './day-field'
import { CurrencyInput } from '../../../../currency-input'

type ReceiptHeaderProps = {
  date?: number
  shop?: string
  total?: number
  onSave: (date?: number, shop?: string) => void
  onUpdate: (field: keyof Receipt, value: any) => void
  children: (date?: number, shop?: string) => ReactNode
}

export const ReceiptHeader: FC<ReceiptHeaderProps> = ({ date, shop, total, onSave, onUpdate, children }) => {
  const updateDate = useCallback((day) => onUpdate('day', day), [onUpdate])
  const updateShop = useCallback((event) => onUpdate('shop', event.target.value), [onUpdate])

  const handleSaving = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.stopPropagation()
      onSave(date, shop)
    }
  }, [date, shop, onSave])

  return (
    <Grid.Row className={styles.header} onKeyDown={handleSaving}>
      <Grid.Column mobile={4} tablet={3} computer={3}>
        <DayField value={date?.toString() || ''} onChange={updateDate} />
      </Grid.Column>
      <Grid.Column mobile={6} tablet={4} computer={4}>
        <Input fluid placeholder="Shop" value={shop} onChange={updateShop} />
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
        {children(date, shop)}
      </Responsive>
    </Grid.Row>
  )
}
