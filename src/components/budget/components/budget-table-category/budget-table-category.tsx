import React, { FC, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Responsive, Table } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import cx from 'classnames'

import { Actions as CategoryActions, CategoryType, Selectors as CategorySelectors } from '../../../categories'
import { createCategoryEntrySelector, plannedValueDisabled, realValueDisabled } from '../../budget.selectors'
import { BudgetTableSubcategory } from '../budget-table-subcategory'
import { CurrencyInput } from '../../../currency-input'
import { updateEntry } from '../../budget.actions'
import { AddButton } from '../add-button'
import { EditableText } from '../editable-text'

import styles from './budget-table-category.module.css'

type BudgetTableCategoryProps = {
  categoryId: number
  categoryType: CategoryType
  editable: boolean
  loading: boolean
}

// TODO: Add navigable table
export const BudgetTableCategory: FC<BudgetTableCategoryProps> = ({ categoryType, categoryId, editable, loading }) => {
  const intl = useIntl()
  const categorySelector = useMemo(() => CategorySelectors.createCategorySelector(categoryId), [categoryId])
  const entrySelector = useMemo(() => createCategoryEntrySelector(categoryId), [categoryId])

  const category = useSelector(categorySelector)
  const entry = useSelector(entrySelector)

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
    (value: string) => dispatch(CategoryActions.addCategory({
      id: Date.now(),
      name: value,
      parentId: categoryId,
      type: categoryType
    })),
    [dispatch, categoryId, categoryType],
  )
  const editCategory = useCallback(
    (name: string) => dispatch(CategoryActions.updateCategory({ name, id: categoryId })),
    [dispatch, categoryId],
  )
  const removeCategory = useCallback(
    () => dispatch(CategoryActions.deleteCategory({ id: categoryId, type: categoryType })),
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
              disabled={hasChildren || loading || saving || plannedValueDisabled(categoryType)}
              label={intl.formatMessage({ id: 'budget.table.planned' })}
              value={entry.plan}
              onUpdate={updatePlanned}
            />
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <CurrencyInput
              currency="PLN"
              disabled={hasChildren || loading || saving || realValueDisabled(categoryType)}
              label={intl.formatMessage({ id: 'budget.table.real' })}
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
              loading={loading}
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
                label={intl.formatMessage({ id: 'budget.table.add-subcategory' })}
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
