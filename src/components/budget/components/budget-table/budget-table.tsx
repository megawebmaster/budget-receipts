import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Header, Segment, SemanticCOLORS } from 'semantic-ui-react'

import { Actions as CategoryActions, CategoryType, Selectors as CategorySelectors } from '../../../categories'
import { createSummarySelector } from '../../budget.selectors'
import { BudgetTableCategory } from '../budget-table-category'
import { AddButton } from '../add-button'

import styles from './budget-table.module.css'

type BudgetTableProps = {
  categoryType: CategoryType
  children?: ReactNode
  color: SemanticCOLORS
  editable: boolean
  label: string
  loading: boolean
}

export const BudgetTable: FC<BudgetTableProps> = ({ categoryType, children, color, editable, label, loading }) => {
  const intl = useIntl()
  const formatCurrency = useCallback(
    (value: number) =>
      intl.formatNumber(value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [intl],
  )

  const plannedSelector = useMemo(() => createSummarySelector(categoryType, 'plan'), [categoryType])
  const realSelector = useMemo(() => createSummarySelector(categoryType, 'real'), [categoryType])

  const categories = useSelector(CategorySelectors.categories[categoryType])
  const plannedSummary = useSelector(plannedSelector)
  const realSummary = useSelector(realSelector)

  const dispatch = useDispatch()
  const createCategory = useCallback(
    (value: string) => dispatch(CategoryActions.addCategory({
      id: Date.now(),
      name: value,
      type: categoryType,
    })),
    [dispatch, categoryType],
  )

  return categories.length === 0 && !editable ? null : (
    <Segment.Group>
      <Segment.Group horizontal className={styles.headerContainer}>
        <Segment basic color={color} className={styles.header}>
          <Header as="h3">{label}</Header>
        </Segment>
        <Segment basic color={color} className={styles.header}>
          <strong>
            <span className={styles.headerTitle}><FormattedMessage id="budget.table.planned" />:</span>
            <span className={styles.headerValue}>{formatCurrency(plannedSummary)} PLN</span>
          </strong>
        </Segment>
        <Segment basic color={color} className={styles.header}>
          <strong>
            <span className={styles.headerTitle}><FormattedMessage id="budget.table.real" />:</span>
            <span className={styles.headerValue}>{formatCurrency(realSummary)} PLN</span>
          </strong>
        </Segment>
      </Segment.Group>
      <Segment className={styles.content}>
        {categories.map(category => (
          <BudgetTableCategory
            key={`category-${category.id}`}
            categoryId={category.id}
            categoryType={category.type}
            editable={editable}
            loading={loading}
          />
        ))}
        {children}
        {editable && (
          <AddButton
            className={styles.addCategory}
            disabled={loading}
            label={intl.formatMessage({ id: 'budget.table.add-category' })}
            size="large"
            onSave={createCategory}
          />
        )}
      </Segment>
    </Segment.Group>
  )
}
