import React, { FC, Fragment } from 'react'
import { Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import { MonthList } from '../../../month-list'
import { AvailableRoutes } from '../../../../routes'
import { AppMessage, MessageList } from '../../../message-list'

import styles from './budget.module.css'

type BudgetProps = {
  year: number,
  month: number,
  messages: AppMessage[],
  loading?: boolean,
}

export const Budget: FC<BudgetProps> = ({ year, month, messages, loading }) => (
  <Fragment>
    <Helmet>
      <title>Budget - Simply Budget Receipts</title>
    </Helmet>
    <Grid className={styles.container}>
      <GridColumn mobile={16} tablet={16} computer={3}>
        <MonthList route={AvailableRoutes.BUDGET_MONTH} showSpinner={loading} />
      </GridColumn>
      <GridColumn mobile={16} tablet={16} computer={13}>
        <Responsive as={Segment} {...Responsive.onlyComputer}>
          <Header as="h3">
            Budget: {month}.{year}
            {loading && <Segment basic loading size="mini" floated="right" />}
          </Header>
        </Responsive>
        <MessageList messages={messages} />
      </GridColumn>
    </Grid>
  </Fragment>
)
