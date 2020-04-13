import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import cx from 'classnames'

import { Selectors as CategorySelectors } from '../../../categories'
import { createSummarySelector } from '../../budget.selectors'
import { CurrencyInput } from '../../../currency-input'

import styles from './irregular-summary.module.css'
import tableStyles from '../budget-table-category/budget-table-category.module.css'
import { Selectors as SettingsSelectors } from '../../../settings'

export const IrregularSummary = () => {
  const spentSelector = useMemo(() => createSummarySelector('irregular', 'real'), [])
  const plannedSelector = useMemo(() => createSummarySelector('irregular', 'plan'), [])

  const hasIrregularCategories = useSelector(CategorySelectors.hasIrregularCategories)
  const spent = useSelector(spentSelector)
  const planned = useSelector(plannedSelector)
  const currency = useSelector(SettingsSelectors.currency)
  const addFunds = planned - spent

  if (!hasIrregularCategories) {
    return null
  }

  return (
    <Table
      singleLine
      compact
      className={cx(tableStyles.table, tableStyles.single)}
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={8} className={styles.right}>
            <FormattedMessage id={`budget.irregular-summary.${addFunds >= 0 ? 'add' : 'subtract'}-funds`} />
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <CurrencyInput
              currency={currency}
              disabled
              value={addFunds}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    </Table>
  )
}
