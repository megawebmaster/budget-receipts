import React, { FC, Fragment } from 'react'
import Helmet from 'react-helmet'
import { Grid, GridColumn, Header, Message, Responsive, Segment } from 'semantic-ui-react'

import { MonthList } from '../../../month-list'
import { AvailableRoutes } from '../../../../routes'
import { ExpensesList } from '../expenses-list'

import styles from './expenses.module.css'

export type ExpensesProps = {
  year: number,
  month: number,
  errors: string[],
  loading?: boolean,
}

export const Expenses: FC<ExpensesProps> = ({ year, month, errors, loading = false }) => (
  <Fragment>
    <Helmet>
      <title>Expenses - Simply Budget Receipts</title>
    </Helmet>
    <Grid className={styles.container}>
      <GridColumn mobile={16} tablet={16} computer={3}>
        <MonthList route={AvailableRoutes.EXPENSES_MONTH} showSpinner={loading} />
      </GridColumn>
      <GridColumn mobile={16} tablet={16} computer={13}>
        <Responsive as={Segment} {...Responsive.onlyComputer}>
          <Header as="h3">
            Expenses: {month}.{year}
            {loading && <Segment basic loading size="mini" floated="right" />}
          </Header>
        </Responsive>
        {errors.map(error => (
          <Message key={error} error content={error} />
        ))}
        <ExpensesList />
      </GridColumn>
    </Grid>
  </Fragment>
)
