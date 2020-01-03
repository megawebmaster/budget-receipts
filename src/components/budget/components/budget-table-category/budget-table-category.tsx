import React, { FC, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { Responsive, Table } from 'semantic-ui-react'

import { CategoryType, createCategory, createCategorySelector } from '../../../categories'
import { budgetLoading, createCategoryEntrySelector } from '../../budget.selectors'
import { BudgetTableSubcategory } from '../budget-table-subcategory'
import { CurrencyInput } from '../../../currency-input'
import { updateEntry } from '../../budget.actions'

import styles from './budget-table-category.module.css'
import { AddButton } from '../add-button'

type BudgetTableCategoryProps = {
  categoryId: number
  categoryType: CategoryType
  editable: boolean
}

// TODO: Add navigable table
export const BudgetTableCategory: FC<BudgetTableCategoryProps> = ({ categoryType, categoryId, editable }) => {
  const categorySelector = useMemo(() => createCategorySelector(categoryId), [categoryId])
  const entrySelector = useMemo(() => createCategoryEntrySelector(categoryType, categoryId), [categoryType, categoryId])

  const category = useSelector(categorySelector)
  const entry = useSelector(entrySelector)
  const loading = useSelector(budgetLoading)

  const dispatch = useDispatch()
  const updatePlanned = useCallback(
    (value: number) => dispatch(updateEntry({ categoryId, value, type: 'plan' })),
    [dispatch, categoryId],
  )
  const updateReal = useCallback(
    (value: number) => dispatch(updateEntry({ categoryId, value, type: 'real' })),
    [dispatch, categoryId],
  )
  const addSubcategory = useCallback(
    (value: string) => dispatch(createCategory({ value, parentId: categoryId, type: categoryType })),
    [dispatch, categoryId],
  )

  if (!category) {
    return null
  }

  const hasChildren = category.children && category.children.length > 0

  // TODO: Add margin bottom to non-single table only
  return (
    <Table
      key={category.id}
      singleLine
      compact
      className={cx(styles.table, { [styles.single]: !editable && !hasChildren })}
    >
      <Responsive
        as={Table.Header}
        minWidth={hasChildren ? Responsive.onlyTablet.minWidth : Responsive.onlyMobile.minWidth}
      >
        <Table.Row>
          <Table.HeaderCell width={4}>
            <span>{category.name}</span>
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <CurrencyInput
              currency="PLN"
              disabled={hasChildren || loading}
              label="Planned"
              value={entry.plan}
              onUpdate={updatePlanned}
            />
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <CurrencyInput
              currency="PLN"
              disabled={hasChildren || loading}
              label="Real"
              value={entry.real}
              onUpdate={updateReal}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Responsive>
      {category.children && (
        <Table.Body>
          {category.children.map(subcategory => (
            <BudgetTableSubcategory
              key={`subcategory-${subcategory.id}`}
              categoryId={category.id}
              subcategoryId={subcategory.id}
              categoryType={categoryType}
            />
          ))}
        </Table.Body>
      )}
      {editable && (
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3}>
              <AddButton disabled={loading} label="Add subcategory…" size="mini" onSave={addSubcategory} />
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  )
}
