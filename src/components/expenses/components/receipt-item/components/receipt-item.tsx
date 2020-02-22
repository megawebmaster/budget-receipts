import React, { FC, useCallback } from 'react'
import { Grid, Input } from 'semantic-ui-react'

import styles from '../receipt-item.module.css'
import { NewReceiptItem } from '../../../receipt.types'
import { CategoryField } from './category-field'
import { CurrencyInput } from '../../../../currency-input'
import { ExpenseFields, FocusableExpenseFields, ReceiptItemFields } from '../../expense/expense.types'

type ReceiptItemProps = {
  addField?: (field: FocusableExpenseFields, input: HTMLInputElement | null) => void
  categoryId?: number | string
  children: JSX.Element
  description?: string
  disabled: boolean
  onBlur?: (field: ExpenseFields, value: any) => void
  onKeyDown?: (field: ExpenseFields, event: React.KeyboardEvent, item: NewReceiptItem) => void
  onUpdate: (key: ReceiptItemFields, value: any) => void
  value: number | string
}

export const ReceiptItem: FC<ReceiptItemProps> =
  ({ addField, categoryId, children, description, disabled, onBlur, onKeyDown, onUpdate, value }) => {
    const addCategoryField = useCallback(
      (input: HTMLInputElement | null) => addField && addField('category', input),
      [addField],
    )

    const updateCategory = useCallback((event, data) => onUpdate('categoryId', data.value), [onUpdate])
    const updateValue = useCallback((value: number) => onUpdate('value', value), [onUpdate])
    const updateDescription = (event: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate('description', event.currentTarget.value)

    const categoryKeyDown = useCallback(
      (event: React.KeyboardEvent, newValue: number) => onKeyDown && onKeyDown('categoryId', event, {
        description,
        categoryId: newValue,
        value: value as number,
      }),
      [onKeyDown, description, value],
    )
    const valueKeyDown = useCallback(
      (event: React.KeyboardEvent, newValue: number) => onKeyDown && onKeyDown('value', event, {
        description,
        categoryId: categoryId as number,
        value: newValue,
      }),
      [onKeyDown, categoryId, description],
    )
    const descriptionKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
      onKeyDown && onKeyDown('description', event, {
        value: value as number,
        categoryId: categoryId as number,
        description: event.currentTarget.value,
      })

    const categoryBlur = useCallback(
      (newValue: number) => onBlur && onBlur('categoryId', newValue),
      [onBlur],
    )
    const valueBlur = useCallback(
      (newValue: number) => onBlur && onBlur('value', newValue),
      [onBlur],
    )
    const descriptionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur('description', event.currentTarget.value)
      }
    }

    return (
      <Grid.Row className={styles.item}>
        <Grid.Column mobile={8} tablet={6} computer={6}>
          <CategoryField
            addField={addCategoryField}
            onBlur={categoryBlur}
            onChange={updateCategory}
            onKeyDown={categoryKeyDown}
            value={categoryId}
          />
        </Grid.Column>
        <Grid.Column mobile={8} tablet={3} computer={3}>
          <CurrencyInput
            narrowOnMobile
            currency="PLN"
            disabled={disabled}
            onBlur={valueBlur}
            onKeyDown={valueKeyDown}
            onUpdate={updateValue}
            value={value}
          />
        </Grid.Column>
        <Grid.Column mobile={11} tablet={5} computer={5}>
          <Input
            fluid
            disabled={disabled}
            onBlur={descriptionBlur}
            onChange={updateDescription}
            onKeyDown={descriptionKeyDown}
            placeholder="Description"
            value={description}
          />
        </Grid.Column>
        <Grid.Column mobile={5} tablet={2} computer={2}>
          {children}
        </Grid.Column>
      </Grid.Row>
    )
  }
