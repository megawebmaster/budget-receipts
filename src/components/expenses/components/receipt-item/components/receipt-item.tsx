import React, { FC, useCallback } from 'react'
import { Grid, Input } from 'semantic-ui-react'

import styles from '../receipt-item.module.css'
import { ReceiptItem as ItemType } from '../../../receipt.types'
import { CategoryField } from './category-field'
import { CurrencyInput } from '../../../../currency-input'
import { ExpenseFields, FocusableExpenseFields } from '../../expense/expense.types'

export type ExpensesListItemProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  category?: number | string
  children: JSX.Element
  description?: string
  disabled: boolean
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent, value: any) => void
  onUpdate: (key: keyof ItemType, value: any) => void
  value: number | string
}

export const ReceiptItem: FC<ExpensesListItemProps> =
  ({ addField, category, children, description, disabled, onKeyDown, onUpdate, value }) => {
    const updateCategory = useCallback((event, data) => onUpdate('category', data.value), [onUpdate])
    const updateValue = useCallback((value: number) => onUpdate('value', value), [onUpdate])
    const updateDescription = useCallback((event) => onUpdate('description', event.target.value), [onUpdate])

    const addCategoryField = useCallback(
      (input: HTMLInputElement | null) => addField && addField('category', input),
      [addField],
    )
    const categoryKeyDown = useCallback(
      (event: React.KeyboardEvent) => onKeyDown && onKeyDown('category', event, null),
      [onKeyDown],
    )
    const valueKeyDown = useCallback(
      (event: React.KeyboardEvent, value: number) => onKeyDown && onKeyDown('value', event, value),
      [onKeyDown],
    )
    const descriptionKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown('description', event, event.currentTarget.value),
      [onKeyDown],
    )

    return (
      <Grid.Row className={styles.item}>
        <Grid.Column mobile={8} tablet={6} computer={6}>
          <CategoryField
            addField={addCategoryField}
            onChange={updateCategory}
            onKeyDown={categoryKeyDown}
            value={category}
          />
        </Grid.Column>
        <Grid.Column mobile={8} tablet={3} computer={3}>
          <CurrencyInput
            narrowOnMobile
            currency="PLN"
            disabled={disabled}
            value={value}
            onUpdate={updateValue}
            onKeyDown={valueKeyDown}
          />
        </Grid.Column>
        <Grid.Column mobile={11} tablet={5} computer={5}>
          <Input
            fluid
            disabled={disabled}
            placeholder="Description"
            value={description}
            onChange={updateDescription}
            onKeyDown={descriptionKeyDown}
          />
        </Grid.Column>
        <Grid.Column mobile={5} tablet={2} computer={2}>
          {children}
        </Grid.Column>
      </Grid.Row>
    )
  }
