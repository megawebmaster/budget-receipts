import React, { Fragment } from "react"
import { Button, Divider, Grid, Responsive, Segment } from "semantic-ui-react"
import { ExpensesListHeader } from "../expenses-list-header"
import { ExpensesListItem } from "../expenses-list-item"

import styles from "./expenses-list.module.css"

export const ExpensesList = () => (
  <Fragment>
    <Grid as={Segment} className={styles.container}>
      <ExpensesListHeader date="20.05" shop="Lidl" total={300} showButtons={false}/>
      <ExpensesListItem category="c2" price={200} description="Test 1">
        <Button fluid icon="trash" color="red"/>
      </ExpensesListItem>
      <ExpensesListItem category="c1" price={100} description="Test 2">
        <Button fluid icon="trash" color="red"/>
      </ExpensesListItem>
      <Divider className={styles.divider}/>
      <ExpensesListItem>
        <Button fluid icon="plus" color="green"/>
      </ExpensesListItem>
      <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
        <Button fluid icon="arrow up"/>
      </Responsive>
    </Grid>
    <Grid as={Segment} className={styles.container}>
      <ExpensesListHeader showButtons={true}/>
    </Grid>
  </Fragment>
)