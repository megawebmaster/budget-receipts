import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonProps, Grid, GridColumn, Header, Responsive, Segment } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import { FormattedMessage, useIntl } from 'react-intl'

import { Menu } from '../menu'
import { Selectors as RouteSelectors } from '../../../../routes'
import { MessageList } from '../../../message-list'
import { BudgetTable } from '../budget-table'
import { hasVisibleCategories } from '../../../categories'

import styles from './irregular-budget.module.css'

export const IrregularBudget = () => {
  const intl = useIntl()
  const loading = false // useSelector(budgetLoading)
  const hasCategories = useSelector(hasVisibleCategories)
  const [editable, setEditable] = useState(!loading && !hasCategories)
  const toggleEditable = useCallback(() => setEditable(value => !value), [setEditable])
  const year = useSelector(RouteSelectors.year)

  const editCategoriesButtonProps: ButtonProps = {
    color: editable ? 'red' : 'blue',
    icon: editable ? 'cancel' : 'pencil',
    onClick: toggleEditable,
    content: editable
      ? intl.formatMessage({ id: 'irregular-budget.edit-categories-close' })
      : intl.formatMessage({ id: 'irregular-budget.edit-categories' }),
    disabled: loading,
  }

  const label = (year: string) => intl.formatMessage(
    { id: 'irregular-budget.dropdown-label' },
    {
      year,
      label: intl.formatMessage({ id: 'irregular-budget.month-header' }),
    },
  )

  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'irregular-budget.title' })}</title>
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
                id="irregular-budget.header"
                values={{ year }}
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
            color="blue"
            categoryType="irregular"
            editable={editable}
            label={intl.formatMessage({ id: 'budget.section.irregular' })}
          />
        </GridColumn>
      </Grid>
    </Fragment>
  )
}
