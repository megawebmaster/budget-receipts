import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonProps, Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import { FormattedMessage, useIntl } from 'react-intl'

import { Menu } from '../menu'
import { Selectors as RouteSelectors } from '../../../../routes'
import { MessageList } from '../../../message-list'
import { budgetLoading } from '../../budget.selectors'
import { BudgetTable } from '../budget-table'
import { Selectors as CategorySelectors } from '../../../categories'

import styles from './budget.module.css'
import { BudgetSummary } from '../budget-summary'

export const Budget = () => {
  const intl = useIntl()
  const loading = useSelector(budgetLoading)
  const hasCategories = useSelector(CategorySelectors.hasVisibleCategories)
  const [editable, setEditable] = useState(!loading && !hasCategories)
  const toggleEditable = useCallback(() => setEditable(value => !value), [setEditable])
  const { year, month } = useSelector(RouteSelectors.budgetParams)

  const editCategoriesButtonProps: ButtonProps = {
    color: editable ? 'red' : 'blue',
    icon: editable ? 'cancel' : 'pencil',
    onClick: toggleEditable,
    content: editable
      ? intl.formatMessage({ id: 'budget.edit-categories-close' })
      : intl.formatMessage({ id: 'budget.edit-categories' }),
    disabled: loading,
  }

  const label = (year: string, month: string) => intl.formatMessage(
    { id: 'month-list.dropdown-label' },
    {
      year,
      month,
      label: intl.formatMessage({ id: 'budget.month-header' }),
    },
  )

  // TODO: Extract currency to a settings module
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'budget.title' })}</title>
      </Helmet>
      <Grid className={styles.container}>
        <GridColumn mobile={16} tablet={16} computer={3}>
          <Menu label={label}>
            <Responsive as={Button} {...Responsive.onlyTablet} {...editCategoriesButtonProps} />
            {loading && (
              <Segment basic loading size="tiny" className={styles.inlineLoader} />
            )}
          </Menu>
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
          <MessageList />
          <BudgetTable
            categoryType="income"
            color="green"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.income' })}
            loading={loading}
          />
          <BudgetTable
            categoryType="expense"
            color="yellow"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.expense' })}
            loading={loading}
          />
          <BudgetTable
            categoryType="irregular"
            color="blue"
            editable={false}
            label={intl.formatMessage({ id: 'budget.section.irregular' })}
            loading={loading}
          />
          <BudgetTable
            categoryType="saving"
            color="red"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.saving' })}
            loading={loading}
          />
          <BudgetSummary color="teal" />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
