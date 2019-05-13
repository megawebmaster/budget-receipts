import React, { FC } from "react"
import { Grid, Input, Responsive } from "semantic-ui-react"

import styles from "./receipt-header.module.css"

type ExpensesListHeaderProps = {
  date?: string,
  shop?: string,
  total?: number,
  children?: JSX.Element | JSX.Element[]
}

export const ReceiptHeader: FC<ExpensesListHeaderProps> = ({ date, shop, total, children }) => (
  <Grid.Row className={styles.header}>
    <Grid.Column mobile={5} tablet={4} computer={4}>
      <Input fluid placeholder="Date" defaultValue={date}/>
    </Grid.Column>
    <Grid.Column mobile={5} tablet={4} computer={4}>
      <Input fluid placeholder="Shop" defaultValue={shop}/>
    </Grid.Column>
    <Grid.Column mobile={6} tablet={4} computer={4}>
      <Input fluid placeholder="Total" labelPosition="right" label="PLN" defaultValue={total} disabled
             className={styles.disabledInput}/>
    </Grid.Column>
    <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Grid.Column} width={4}>
      {children}
    </Responsive>
  </Grid.Row>
)