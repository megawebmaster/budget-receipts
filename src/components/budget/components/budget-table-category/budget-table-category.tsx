import React, { FC, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { Responsive, Table } from 'semantic-ui-react'

import {
  CategoryType,
  addCategory,
  createCategorySelector,
  deleteCategory,
  updateCategory,
} from '../../../categories'
import { budgetLoading, createCategoryEntrySelector } from '../../budget.selectors'
import { BudgetTableSubcategory } from '../budget-table-subcategory'
import { CurrencyInput } from '../../../currency-input'
import { updateEntry } from '../../budget.actions'

import styles from './budget-table-category.module.css'
import { AddButton } from '../add-button'
import { EditableText } from '../editable-text'

type BudgetTableCategoryProps = {
  categoryId: number
  categoryType: CategoryType
  editable: boolean
}

// TODO: Add navigable table
export const BudgetTableCategory: FC<BudgetTableCategoryProps> = ({ categoryType, categoryId, editable }) => {
  const categorySelector = useMemo(() => createCategorySelector(categoryId), [categoryId])
  const entrySelector = useMemo(() => createCategoryEntrySelector(categoryId), [categoryId])

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
  const createSubcategory = useCallback(
    (value: string) => dispatch(addCategory({
      id: Date.now(),
      name: value,
      parentId: categoryId,
      type: categoryType
    })),
    [dispatch, categoryId, categoryType],
  )
  const editCategory = useCallback(
    (name: string) => dispatch(updateCategory({ name, id: categoryId })),
    [dispatch, categoryId],
  )
  const removeCategory = useCallback(
    () => dispatch(deleteCategory({ id: categoryId, type: categoryType })),
    [dispatch, categoryId, categoryType],
  )

  if (!category) {
    return null
  }

  const hasChildren = category.children && category.children.length > 0
  const saving = Boolean(category.saving)

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
            <EditableText
              editable={editable}
              saving={saving}
              value={category.name}
              onDelete={removeCategory}
              onSave={editCategory}
            >
              {category.name}
            </EditableText>
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <CurrencyInput
              currency="PLN"
              disabled={hasChildren || loading || saving}
              label="Planned"
              value={entry.plan}
              onUpdate={updatePlanned}
            />
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <CurrencyInput
              currency="PLN"
              disabled={hasChildren || loading || saving}
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
              categoryType={categoryType}
              editable={editable}
              subcategoryId={subcategory.id}
            />
          ))}
        </Table.Body>
      )}
      {editable && (
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3}>
              <AddButton
                disabled={loading || saving}
                label="Add subcategory…"
                size="mini"
                onSave={createSubcategory}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  )
}
