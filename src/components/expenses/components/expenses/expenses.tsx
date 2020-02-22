import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { useSelector } from 'react-redux'
import { Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { MonthList } from '../../../month-list'
import { AvailableRoutes, month as monthSelector, year as yearSelector } from '../../../../routes'
import { pageMessages } from '../../../page/page.selectors'
import { ExpensesList } from '../expenses-list'
import { MessageList } from '../../../message-list'
import { expensesLoading } from '../../expenses.selectors'

import styles from './expenses.module.css'

export const Expenses = () => {
  const year = useSelector(yearSelector)
  const month = useSelector(monthSelector)
  const messages = useSelector(pageMessages)
  const loading = useSelector(expensesLoading)
  const intl = useIntl()

  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'expenses.title' })}</title>
      </Helmet>
      <Grid className={styles.container}>
        <GridColumn mobile={16} tablet={16} computer={3}>
          <MonthList
            route={AvailableRoutes.EXPENSES_MONTH}
            label={intl.formatMessage({ id: 'expenses.header' })}
          >
            {loading && (
              <Segment basic loading size="tiny" className={styles.inlineLoader} />
            )}
          </MonthList>
        </GridColumn>
        <GridColumn mobile={16} tablet={16} computer={13}>
          <Responsive as={Segment} {...Responsive.onlyComputer}>
            <Header as="h3">
              <FormattedMessage id="expenses.header" />: <FormattedMessage id={`month-${month}`} /> {year}
              {loading && <Segment basic loading size="mini" floated="right" />}
            </Header>
          </Responsive>
          <MessageList messages={messages} />
          <ExpensesList />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
