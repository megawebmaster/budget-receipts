import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { useSelector } from 'react-redux'
import { Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'

import { MonthList } from '../../../month-list'
import { AvailableRoutes, month as monthSelector, year as yearSelector } from '../../../../routes'
import { pageMessages } from '../../../page/page.selectors'
import { ExpensesList } from '../expenses-list'
import { MessageList } from '../../../message-list'
import { expensesLoading } from '../../expenses.selectors'

import styles from './expenses.module.css'

export const Expenses = React.memo(
  () => {
    const year = useSelector(yearSelector)
    const month = useSelector(monthSelector)
    const messages = useSelector(pageMessages)
    const loading = useSelector(expensesLoading)

    return (
      <Fragment>
        <Helmet>
          <title>Expenses - Simply Budget Receipts</title>
        </Helmet>
        <Grid className={styles.container}>
          <GridColumn mobile={16} tablet={16} computer={3}>
            <MonthList route={AvailableRoutes.EXPENSES_MONTH}>
              {loading && (
                <Segment basic loading size="tiny" className={styles.inlineLoader} />
              )}
            </MonthList>
          </GridColumn>
          <GridColumn mobile={16} tablet={16} computer={13}>
            <Responsive as={Segment} {...Responsive.onlyComputer}>
              <Header as="h3">
                Expenses: {month}.{year}
                {loading && <Segment basic loading size="mini" floated="right" />}
              </Header>
            </Responsive>
            <MessageList messages={messages} />
            <ExpensesList />
          </GridColumn>
        </Grid>
      </Fragment>
    )
  },
)
