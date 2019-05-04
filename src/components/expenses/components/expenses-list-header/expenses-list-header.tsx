import React, { FC } from "react"
import { Button, ButtonGroup, Grid, Input, Responsive } from "semantic-ui-react"

import styles from "./expenses-list-header.module.css"

type ExpensesListHeaderProps = {
  date?: string,
  shop?: string,
  total?: number,
  showButtons: boolean,
}

export const ExpensesListHeader: FC<ExpensesListHeaderProps> = ({ date, shop, total, showButtons }) => (
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
    {showButtons && (
      <Responsive as={Grid.Column} mobile={16} tablet={4} computer={4}>
        <ButtonGroup fluid>
          <Button color="blue" icon="photo"/>
          <Button.Or/>
          <Button color="green" icon="plus"/>
        </ButtonGroup>
      </Responsive>
    )}
    {!showButtons && (
      <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Grid.Column} width={4}>
        <Button fluid icon="arrow up"/>
      </Responsive>
    )}
  </Grid.Row>
)