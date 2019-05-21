import React, { FC } from 'react'
import { Dropdown, Grid, Input } from 'semantic-ui-react'

import styles from './receipt-item.module.css'
import { ReceiptItem as ItemType } from '../../receipt'

export type ExpensesListItemProps = {
  category?: string,
  price?: number,
  description?: string,
  children: JSX.Element,
  onUpdate: (key: keyof ItemType, value: any) => void
}

export const ReceiptItem: FC<ExpensesListItemProps> = React.memo(
  ({ category, price, description, onUpdate, children }) => (
    <Grid.Row className={styles.item}>
      <Grid.Column mobile={8} tablet={6} computer={6}>
        <Dropdown
          fluid
          selection
          placeholder="Category"
          options={[{ text: 'Cat 1', value: 'c1' }, { text: 'Cat 2', value: 'c2' }]}
          defaultValue={category}
          onChange={(event, data) => onUpdate('category', data.value)}
        />
      </Grid.Column>
      <Grid.Column mobile={8} tablet={3} computer={3}>
        <Input
          fluid
          placeholder="Price"
          labelPosition="right"
          label="PLN"
          defaultValue={price !== 0 ? price : ''}
          onChange={(event) => onUpdate('price', event.target.value)}
        />
      </Grid.Column>
      <Grid.Column mobile={12} tablet={5} computer={5}>
        <Input
          fluid
          placeholder="Description"
          defaultValue={description}
          onChange={(event) => onUpdate('description', event.target.value)}
        />
      </Grid.Column>
      <Grid.Column mobile={4} tablet={2} computer={2}>
        {children}
      </Grid.Column>
    </Grid.Row>
  ),
)
