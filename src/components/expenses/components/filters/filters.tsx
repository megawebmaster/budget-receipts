import React from 'react'
import { Button, Grid, GridColumn, Header, Segment } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import * as Actions from '../../expenses.actions'
import { CategoryFilter } from './components/category-filter'
import { DayFilter } from './components/day-filter'

import styles from './filters.module.css'

export const Filters = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const resetFilters = () => dispatch(Actions.resetFilters())

  return (
    <Segment className={styles.main} attached="bottom">
      <div className={styles.header}>
        <Header as="h4" className={styles.headerContent}>
          <FormattedMessage id="expenses.filters.title" />
        </Header>
        <Button content={intl.formatMessage({ id: 'expenses.filters.reset' })} onClick={resetFilters} />
      </div>
      <Grid columns={2}>
        <GridColumn>
          <CategoryFilter />
        </GridColumn>
        <GridColumn>
          <DayFilter />
        </GridColumn>
      </Grid>
    </Segment>
  )
}
