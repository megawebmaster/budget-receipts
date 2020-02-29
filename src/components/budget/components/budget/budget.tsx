import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonProps, Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import { FormattedMessage, useIntl } from 'react-intl'

import { MonthList } from '../../../month-list'
import { AvailableRoutes, month as monthSelector, year as yearSelector } from '../../../../routes'
import { MessageList } from '../../../message-list'
import { pageMessages } from '../../../page/page.selectors'
import { budgetLoading } from '../../budget.selectors'
import { BudgetTable } from '../budget-table'

import styles from './budget.module.css'
import { hasVisibleCategories } from '../../../categories'

export const Budget = () => {
  const intl = useIntl()
  const loading = useSelector(budgetLoading)
  const hasCategories = useSelector(hasVisibleCategories)
  const [editable, setEditable] = useState(!loading && !hasCategories)
  const toggleEditable = useCallback(() => setEditable(value => !value), [setEditable])
  const year = useSelector(yearSelector)
  const month = useSelector(monthSelector)
  const messages = useSelector(pageMessages)

  const editCategoriesButtonProps: ButtonProps = {
    color: editable ? 'red' : 'blue',
    icon: editable ? 'cancel' : 'pencil',
    onClick: toggleEditable,
    content: editable
      ? intl.formatMessage({ id: 'budget.edit-categories-close' })
      : intl.formatMessage({ id: 'budget.edit-categories' }),
    disabled: loading,
  }

  // TODO: Extract currency to a settings module
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'budget.title' })}</title>
      </Helmet>
      <Grid className={styles.container}>
        <GridColumn mobile={16} tablet={16} computer={3}>
          <MonthList
            route={AvailableRoutes.BUDGET_MONTH_ENTRIES}
            label={intl.formatMessage({ id: 'budget.month-header' })}
          >
            <Responsive as={Button} {...Responsive.onlyTablet} {...editCategoriesButtonProps} />
            {loading && (
              <Segment basic loading size="tiny" className={styles.inlineLoader} />
            )}
          </MonthList>
        </GridColumn>
        <GridColumn mobile={16} tablet={16} computer={13}>
          <Responsive as={Segment} {...Responsive.onlyComputer} color="grey" className={styles.mainHeader}>
            <Header as="h3" className={styles.mainHeaderContent}>
              <FormattedMessage
                id="budget.header"
                values={{ month: intl.formatMessage({ id: `month-${month}` }), year }}
              />
              {loading && (
                <Segment basic loading size="mini" floated="right" />
              )}
            </Header>
            <Button floated="right" {...editCategoriesButtonProps} />
          </Responsive>
          <Responsive as={Button} fluid{...Responsive.onlyMobile}{...editCategoriesButtonProps} />
          <MessageList messages={messages} />
          <BudgetTable
            color="green"
            categoryType="income"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.income' })}
          />
          <BudgetTable
            color="yellow"
            categoryType="expense"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.expense' })}
          />
          <BudgetTable
            color="blue"
            categoryType="irregular"
            editable={false}
            label={intl.formatMessage({ id: 'budget.section.irregular' })}
          />
          <BudgetTable
            color="red"
            categoryType="saving"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.saving' })}
          />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
