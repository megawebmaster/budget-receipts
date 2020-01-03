import React, { FC, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import { Header, Segment, SemanticCOLORS } from 'semantic-ui-react'

import { categories as categoriesSelectors, CategoryType, createCategory } from '../../../categories'
import { budgetLoading, createSummarySelector } from '../../budget.selectors'
import { BudgetTableCategory } from '../budget-table-category'
import { AddButton } from '../add-button'

import styles from './budget-table.module.css'

type BudgetTableProps = {
  className?: string
  color: SemanticCOLORS
  categoryType: CategoryType
  editable: boolean
  label: string
}

export const BudgetTable: FC<BudgetTableProps> = ({ label, color, categoryType, editable }) => {
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

  const categories = useSelector(categoriesSelectors[categoryType])
  const plannedSummary = useSelector(plannedSelector)
  const realSummary = useSelector(realSelector)
  const loading = useSelector(budgetLoading)

  const dispatch = useDispatch()
  const addCategory = useCallback(
    (value: string) => dispatch(createCategory({ value, type: categoryType })),
    [dispatch],
  )

  return categories.length === 0 ? null : (
    <Segment.Group>
      <Segment.Group horizontal>
        <Segment basic color={color} className={styles.header}>
          <Header as="h3">{label}</Header>
        </Segment>
        <Segment basic color={color} className={styles.header}>
          <strong>Planned: {formatCurrency(plannedSummary)} PLN</strong>
        </Segment>
        <Segment basic color={color} className={styles.header}>
          <strong>Real: {formatCurrency(realSummary)} PLN</strong>
        </Segment>
      </Segment.Group>
      <Segment className={styles.content}>
        {categories.map(category => (
          <BudgetTableCategory
            key={`category-${category.id}`}
            categoryId={category.id}
            categoryType={category.type}
            editable={editable}
          />
        ))}
        {editable && (
          <AddButton
            className={styles.addCategory}
            disabled={loading}
            label="Add category…"
            size="large"
            onSave={addCategory}
          />
        )}
      </Segment>
    </Segment.Group>
  )
}
