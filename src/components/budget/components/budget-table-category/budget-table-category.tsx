import React, { FC, useMemo } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Button, Input, Label, Responsive, Table } from 'semantic-ui-react'

import { CategoryType, createCategorySelector } from '../../../categories'
import { budgetLoading, createCategoryEntrySelector } from '../../budget.selectors'
import { BudgetTableSubcategory } from '../budget-table-subcategory'

import styles from './budget-table-category.module.css'

type BudgetTableCategoryProps = {
  categoryId: number
  categoryType: CategoryType
  editable: boolean
}

// TODO: Add value editing
// TODO: Add navigable table
export const BudgetTableCategory: FC<BudgetTableCategoryProps> = ({ categoryType, categoryId, editable }) => {
  const categorySelector = useMemo(() => createCategorySelector(categoryId), [categoryId])
  const entrySelector = useMemo(() => createCategoryEntrySelector(categoryType, categoryId), [categoryType, categoryId])

  const category = useSelector(categorySelector)
  const entry = useSelector(entrySelector)
  const loading = useSelector(budgetLoading)

  if (!category) {
    return null
  }

  const hasChildren = category.children && category.children.length > 0

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
            <Input fluid labelPosition="right" value={entry.plan} disabled={hasChildren || loading}>
              <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
                Planned:
              </Responsive>
              <input />
              <Label>PLN</Label>
            </Input>
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            <Input fluid labelPosition="right" value={entry.real} disabled={hasChildren || loading}>
              <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
                Real:
              </Responsive>
              <input />
              <Label>PLN</Label>
            </Input>
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
              <Button fluid basic size="tiny">Add subcategory…</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  )
}
