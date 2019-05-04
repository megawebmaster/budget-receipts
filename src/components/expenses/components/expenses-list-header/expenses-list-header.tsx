import React from "react"
import { Button, ButtonGroup, Grid, Input } from "semantic-ui-react"

import styles from './expenses-list-header.module.css'

export const ExpensesListHeader = () => (
  <Grid.Row className={styles.header}>
    <Grid.Column mobile={8} tablet={5} computer={5}>
      <Input fluid placeholder="Date"/>
    </Grid.Column>
    <Grid.Column mobile={8} tablet={5} computer={5}>
      <Input fluid placeholder="Shop"/>
    </Grid.Column>
    <Grid.Column mobile={16} tablet={6} computer={6}>
      <ButtonGroup fluid>
        <Button color="blue" icon="photo"/>
        <Button.Or/>
        <Button color="green" icon="plus"/>
      </ButtonGroup>
    </Grid.Column>
  </Grid.Row>
)