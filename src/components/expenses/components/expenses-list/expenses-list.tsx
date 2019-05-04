import React, { Fragment } from "react"
import { Button, ButtonGroup, Dropdown, Grid, Input } from "semantic-ui-react"
import { ExpensesListHeader } from "../expenses-list-header"

export const ExpensesList = () => (
  <Fragment>
    <Grid>
      <ExpensesListHeader/>
      {/*<Grid.Row>*/}
      {/*  <Grid.Column mobile={8} tablet={6} computer={6}>*/}
      {/*    <Dropdown*/}
      {/*      fluid*/}
      {/*      selection*/}
      {/*      options={[{ text: "Cat 1", value: "c1" }, { text: "Cat 2", value: "c2" }]}*/}
      {/*      defaultValue="c2"*/}
      {/*    />*/}
      {/*  </Grid.Column>*/}
      {/*  <Grid.Column mobile={8} tablet={3} computer={3}>*/}
      {/*    <Input fluid placeholder="Price" labelPosition="right" label="PLN"/>*/}
      {/*  </Grid.Column>*/}
      {/*  <Grid.Column mobile={12} tablet={5} computer={5}>*/}
      {/*    <Input fluid placeholder="Description"/>*/}
      {/*  </Grid.Column>*/}
      {/*  <Grid.Column mobile={4} tablet={2} computer={2}>*/}
      {/*    <Button fluid icon="plus" color="green"/>*/}
      {/*  </Grid.Column>*/}
      {/*</Grid.Row>*/}
    </Grid>
  </Fragment>
)