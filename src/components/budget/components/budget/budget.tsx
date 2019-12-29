import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonProps, Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'
import Helmet from 'react-helmet'

import { MonthList } from '../../../month-list'
import { AvailableRoutes, month as monthSelector, year as yearSelector } from '../../../../routes'
import { MessageList } from '../../../message-list'
import {
  expensesCategories as expensesCategoriesSelector,
  incomeCategories as incomeCategoriesSelector,
  irregularCategories as irregularCategoriesSelector,
  savingsCategories as savingsCategoriesSelector,
} from '../../../categories'
import { pageMessages } from '../../../page/page.selectors'
import { budgetLoading } from '../../budget.selectors'
import { BudgetTable } from '../budget-table'

import styles from './budget.module.css'

export const Budget = () => {
  const [editable, setEditable] = useState(false)
  const toggleEditable = useCallback(() => setEditable(!editable), [editable, setEditable])
  const incomeCategories = useSelector(incomeCategoriesSelector)
  const expensesCategories = useSelector(expensesCategoriesSelector)
  const irregularCategories = useSelector(irregularCategoriesSelector)
  const savingsCategories = useSelector(savingsCategoriesSelector)
  const year = useSelector(yearSelector)
  const month = useSelector(monthSelector)
  const messages = useSelector(pageMessages)
  const loading = useSelector(budgetLoading)

  const editCategoriesButtonProps: ButtonProps = {
    color: editable ? 'red' : 'blue',
    icon: editable ? 'cancel' : 'pencil',
    onClick: toggleEditable,
    content: editable ? 'Close' : 'Edit categories',
  }

  return (
    <Fragment>
      <Helmet>
        <title>Budget - Simply Budget Receipts</title>
      </Helmet>
      <Grid className={styles.container}>
        <GridColumn mobile={16} tablet={16} computer={3}>
          <MonthList route={AvailableRoutes.BUDGET_MONTH}>
            <Responsive as={Button} {...Responsive.onlyTablet} {...editCategoriesButtonProps} />
            {loading && (
              <Segment basic loading size="tiny" className={styles.inlineLoader} />
            )}
          </MonthList>
        </GridColumn>
        <GridColumn mobile={16} tablet={16} computer={13}>
          <Responsive as={Segment} {...Responsive.onlyComputer} color="grey" className={styles.mainHeader}>
            <Header as="h3" className={styles.mainHeaderContent}>
              Budget: {month}.{year}
              {loading && (
                <Segment basic loading size="mini" floated="right" />
              )}
            </Header>
            <Button floated="right" {...editCategoriesButtonProps} />
          </Responsive>
          <Responsive as={Button} fluid{...Responsive.onlyMobile}{...editCategoriesButtonProps} />
          <MessageList messages={messages} />
          <BudgetTable color="green" categories={incomeCategories} editable={editable} label="Income" />
          <BudgetTable color="yellow" categories={expensesCategories} editable={editable} label="Expenses" />
          <BudgetTable color="blue" categories={irregularCategories} editable={editable} label="Irregular expenses" />
          <BudgetTable color="red" categories={savingsCategories} editable={editable} label="Savings" />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
