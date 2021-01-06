import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { useSelector } from 'react-redux'
import { Grid, GridColumn, Header, Segment } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { MonthList } from '../month-list'
import { Selectors as RouteSelectors } from '../../../../routes'
import { ExpensesList } from '../expenses-list'
import { MessageList } from '../../../message-list'
import { expensesLoading } from '../../expenses.selectors'

import styles from './expenses.module.css'

export const Expenses = () => {
  const intl = useIntl()
  const { year, month } = useSelector(RouteSelectors.budgetParams)
  const loading = useSelector(expensesLoading)

  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'expenses.title' })}</title>
      </Helmet>
      <Grid className={styles.container}>
        <GridColumn mobile={16} tablet={16} computer={3}>
          <MonthList>
            {loading && (
              <Segment basic loading size="tiny" className={styles.inlineLoader} />
            )}
          </MonthList>
        </GridColumn>
        <GridColumn mobile={16} tablet={16} computer={13}>
          <Segment className={styles.computerHeader}>
            <Header as="h3">
              <FormattedMessage
                id="expenses.header"
                values={{ month: intl.formatMessage({ id: `month-${month}` }), year }}
              />
              {loading && <Segment basic loading size="mini" floated="right" />}
            </Header>
          </Segment>
          <MessageList />
          <ExpensesList />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
