import React, { FC, Fragment } from "react"
import Helmet from "react-helmet"
import { MonthList } from "../../../month-list"
import { AvailableRoutes } from "../../../../routes"
import { Grid, GridColumn, Header, Responsive, Segment } from "semantic-ui-react"

export type ExpensesProps = {
  year: number,
  month: number,
}

export const Expenses: FC<ExpensesProps> = ({ year, month }) => (
  <Fragment>
    <Helmet>
      <title>Expenses - Simply Budget Receipts</title>
    </Helmet>
    <Grid>
      <GridColumn mobile={16} tablet={16} computer={3}>
        <MonthList route={AvailableRoutes.EXPENSES_MONTH}/>
      </GridColumn>
      <GridColumn mobile={16} tablet={16} computer={13}>
        <Responsive as={Segment} {...Responsive.onlyComputer}>
          <Header as="h1">
            Expenses: {month}.{year}
          </Header>
        </Responsive>
      </GridColumn>
    </Grid>
  </Fragment>
)
