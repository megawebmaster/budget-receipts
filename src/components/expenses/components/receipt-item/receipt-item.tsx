import React, { FC } from "react"
import { Dropdown, Grid, Input } from "semantic-ui-react"

import styles from "./receipt-item.module.css"

export type ExpensesListItemProps = {
  category?: string,
  price?: number,
  description?: string,
  children: JSX.Element,
}

export const ReceiptItem: FC<ExpensesListItemProps> = ({ category, price, description, children }) => (
  <Grid.Row className={styles.item}>
    <Grid.Column mobile={8} tablet={6} computer={6}>
      <Dropdown
        fluid
        selection
        placeholder="Category"
        options={[{ text: "Cat 1", value: "c1" }, { text: "Cat 2", value: "c2" }]}
        defaultValue={category}
      />
    </Grid.Column>
    <Grid.Column mobile={8} tablet={3} computer={3}>
      <Input fluid placeholder="Price" labelPosition="right" label="PLN" defaultValue={price}/>
    </Grid.Column>
    <Grid.Column mobile={12} tablet={5} computer={5}>
      <Input fluid placeholder="Description" defaultValue={description}/>
    </Grid.Column>
    <Grid.Column mobile={4} tablet={2} computer={2}>
      {children}
    </Grid.Column>
  </Grid.Row>
)