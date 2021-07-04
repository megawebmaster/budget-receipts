import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, GridColumn, Header, Segment } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import cx from 'classnames'

import * as Actions from '../../expenses.actions'
import { MonthList } from '../month-list'
import { Selectors as RouteSelectors } from '../../../../routes'
import { ExpensesList } from '../expenses-list'
import { MessageList } from '../../../message-list'
import { allExpensesExpandedSelector, expensesLoading } from '../../expenses.selectors'

import styles from './expenses.module.css'

export const Expenses = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { year, month } = useSelector(RouteSelectors.budgetParams)
  const loading = useSelector(expensesLoading)

  const expanded = useSelector(allExpensesExpandedSelector)
  const toggleExpandAll = () => {
    dispatch(expanded ? Actions.contractAllReceipts() : Actions.expandAllReceipts())
  }

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
          <Segment className={cx(styles.computerHeader, styles.mainHeader)} color="grey">
            <Header as="h3" className={styles.mainHeaderContent}>
              <FormattedMessage
                id="expenses.header"
                values={{ month: intl.formatMessage({ id: `month-${month}` }), year }}
              />
              {loading && <Segment basic loading size="mini" floated="right" />}
            </Header>
            <Button
              disabled={loading}
              floated="right"
              icon={expanded ? 'compress' : 'expand'}
              onClick={toggleExpandAll}
              title={intl.formatMessage({ id: expanded ? 'expenses.contract-all' : 'expenses.expand-all' })}
            />
          </Segment>
          <MessageList />
          <ExpensesList />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
