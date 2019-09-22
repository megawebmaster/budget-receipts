import React, { FC, KeyboardEvent, useCallback } from 'react'
import { Grid, Input } from 'semantic-ui-react'

import styles from '../receipt-item.module.css'
import { ReceiptItem as ItemType } from '../../../receipt.types'
import { CategoryField } from './category-field'

export type ExpensesListItemProps = {
  category?: number
  children: JSX.Element
  description?: string
  disabled: boolean
  price?: number
  onUpdate: (key: keyof ItemType, value: any) => void
  onSave: (category: number | undefined, description: string | undefined, price: number | undefined) => void
}

export const ReceiptItem: FC<ExpensesListItemProps> = React.memo(
  ({ category, description, disabled, price, onSave, onUpdate, children }) => {
    const updateCategory = useCallback((event, data) => onUpdate('category', data.value), [onUpdate])
    const updatePrice = useCallback((event) => onUpdate('price', parseInt(event.target.value, 10)), [onUpdate])
    const updateDescription = useCallback((event) => onUpdate('description', event.target.value), [onUpdate])
    const handleSaving = useCallback((event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.stopPropagation()
        onSave(category, description, price)
      }
    }, [onSave, category, description, price])

    return (
      <Grid.Row className={styles.item} onKeyDown={handleSaving}>
        <Grid.Column mobile={8} tablet={6} computer={6}>
          <CategoryField value={category} onChange={updateCategory} />
        </Grid.Column>
        <Grid.Column mobile={8} tablet={3} computer={3}>
          <Input
            fluid
            disabled={disabled}
            type="number"
            placeholder="Price"
            labelPosition="right"
            label="PLN"
            defaultValue={price !== 0 ? price : ''}
            onChange={updatePrice}
          />
        </Grid.Column>
        <Grid.Column mobile={12} tablet={5} computer={5}>
          <Input
            fluid
            disabled={disabled}
            placeholder="Description"
            defaultValue={description}
            onChange={updateDescription}
          />
        </Grid.Column>
        <Grid.Column mobile={4} tablet={2} computer={2}>
          {children}
        </Grid.Column>
      </Grid.Row>
    )
  },
)
