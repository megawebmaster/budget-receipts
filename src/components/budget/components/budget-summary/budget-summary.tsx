import React, { FC, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Header, Segment, SemanticCOLORS, Table } from 'semantic-ui-react'
import cx from 'classnames'

import { Selectors as CategorySelectors } from '../../../categories'
import { CurrencyInput } from '../../../currency-input'

import styles from './budget-summary.module.css'
import budgetStyles from '../budget-table/budget-table.module.css'
import tableStyles from '../budget-table-category/budget-table-category.module.css'
import { createSummarySelector } from '../../budget.selectors'
import { Selectors as SettingsSelectors } from '../../../settings'

type BudgetSummaryProps = {
  color: SemanticCOLORS
}

// TODO: Make it smaller when not at the bottom?
export const BudgetSummary: FC<BudgetSummaryProps> = ({ color }) => {
  const intl = useIntl()
  const formatCurrency = useCallback(
    (value: number) =>
      intl.formatNumber(value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [intl],
  )

  const planIncomeSelector = useMemo(() => createSummarySelector('income', 'plan'), [])
  const planIrregularSelector = useMemo(() => createSummarySelector('irregular', 'plan'), [])
  const planExpensesSelector = useMemo(() => createSummarySelector(['expense', 'saving'], 'plan'), [])
  const realIncomeSelector = useMemo(() => createSummarySelector('income', 'real'), [])
  const realExpensesSelector = useMemo(() => createSummarySelector(['expense', 'saving'], 'real'), [])

  const hasCategories = useSelector(CategorySelectors.hasVisibleCategories)
  const plannedIncome = useSelector(planIncomeSelector)
  const plannedIrregular = useSelector(planIrregularSelector)
  const plannedExpenses = useSelector(planExpensesSelector)
  const realIncome = useSelector(realIncomeSelector)
  const realExpenses = useSelector(realExpensesSelector)
  const currency = useSelector(SettingsSelectors.currency)

  return !hasCategories ? null : (
    <div className={styles.container}>
      <Segment.Group>
        <Segment.Group horizontal className={budgetStyles.headerContainer}>
          <Segment basic color={color} className={budgetStyles.header}>
            <Header as="h3">
              <FormattedMessage id="budget.summary.header" />
            </Header>
          </Segment>
          <Segment basic color={color} className={budgetStyles.header}>
            <strong>
              <span className={budgetStyles.headerTitle}><FormattedMessage id="budget.table.planned" />:</span>
              <span
                className={budgetStyles.headerValue}>{formatCurrency(plannedExpenses + plannedIrregular)} {currency}</span>
            </strong>
          </Segment>
          <Segment basic color={color} className={budgetStyles.header}>
            <strong>
              <span className={budgetStyles.headerTitle}><FormattedMessage id="budget.table.real" />:</span>
              <span
                className={budgetStyles.headerValue}>{formatCurrency(realExpenses + plannedIrregular)} {currency}</span>
            </strong>
          </Segment>
        </Segment.Group>
        <Segment className={budgetStyles.content}>
          <Table
            singleLine
            compact
            className={cx(tableStyles.table, tableStyles.single)}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={4}>
                  <FormattedMessage id="budget.summary.left-to-use" />
                </Table.HeaderCell>
                <Table.HeaderCell width={4}>
                  <CurrencyInput
                    currency={currency}
                    disabled={true}
                    label={intl.formatMessage({ id: 'budget.table.planned' })}
                    value={plannedIncome - plannedIrregular - plannedExpenses}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell width={4}>
                  <CurrencyInput
                    currency={currency}
                    disabled={true}
                    label={intl.formatMessage({ id: 'budget.table.real' })}
                    value={realIncome - plannedIrregular - realExpenses}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </Segment>
      </Segment.Group>
    </div>
  )
}
