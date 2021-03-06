import React, { FC, ReactNode, useCallback } from 'react'
import { Grid, Input } from 'semantic-ui-react'
import { useIntl } from 'react-intl'

import styles from '../receipt-header.module.css'
import { DayField } from './day-field'
import { CurrencyInput } from '../../../../currency-input'
import { ExpenseFields, FocusableExpenseFields, ReceiptFields } from '../../expense/expense.types'
import { useSelector } from 'react-redux'
import { Selectors as SettingsSelectors } from '../../../../settings'

type ReceiptHeaderProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  children: (day?: number, shop?: string) => ReactNode
  day?: number
  onBlur?: (field: ReceiptFields, value: any) => void
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent, value: any) => void
  onUpdate: (field: ReceiptFields, value: any) => void
  shop?: string
  total?: number
}

export const ReceiptHeader: FC<ReceiptHeaderProps> =
  ({ addField, children, day, onBlur, onKeyDown, onUpdate, shop, total }) => {
    const intl = useIntl()
    const currency = useSelector(SettingsSelectors.currency)
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

    const dayBlur = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => onBlur && onBlur('day', event.currentTarget.value),
      [onBlur],
    )
    const shopBlur = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => onBlur && onBlur('shop', event.currentTarget.value),
      [onBlur],
    )

    return (
      <Grid.Row className={styles.header}>
        <Grid.Column mobile={4} tablet={3} computer={3}>
          <DayField
            addField={addDayField}
            onBlur={dayBlur}
            onChange={updateDate}
            onKeyDown={dayKeyDown}
            value={day?.toString() || ''}
          />
        </Grid.Column>
        <Grid.Column mobile={6} tablet={4} computer={4}>
          <Input
            fluid
            onChange={updateShop}
            onBlur={shopBlur}
            onKeyDown={shopKeyDown}
            placeholder={intl.formatMessage({ id: 'expenses.shop' })}
            value={shop}
          />
        </Grid.Column>
        <Grid.Column mobile={6} tablet={5} computer={5}>
          <CurrencyInput
            narrowOnMobile
            className={styles.disabledInput}
            currency={currency}
            disabled={true}
            value={total || 0}
          />
        </Grid.Column>
        <Grid.Column className={styles.buttons} width={4}>
          {children(day, shop)}
        </Grid.Column>
      </Grid.Row>
    )
  }
