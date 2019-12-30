import React, { FC, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Input, Label, Responsive, Table } from 'semantic-ui-react'

import { CategoryType, createCategorySelector } from '../../../categories'
import { createCategoryEntrySelector } from '../../budget.selectors'

import styles from './budget-table-subcategory.module.css'

type BudgetTableSubcategoryProps = {
  categoryId: number
  subcategoryId: number
  categoryType: CategoryType
}

export const BudgetTableSubcategory: FC<BudgetTableSubcategoryProps> = ({ categoryType, categoryId, subcategoryId }) => {
  const categorySelector = useMemo(() => createCategorySelector(categoryId), [categoryId])
  const subcategorySelector = useMemo(() => createCategorySelector(subcategoryId), [subcategoryId])
  const entrySelector = useMemo(() => createCategoryEntrySelector(categoryType, subcategoryId), [categoryType, subcategoryId])

  const category = useSelector(categorySelector)
  const subcategory = useSelector(subcategorySelector)
  const entry = useSelector(entrySelector)

  if (!category || !subcategory) {
    return null
  }

  return (
    <Table.Row>
      <Table.Cell>
        <span>
          <Responsive as={Fragment} {...Responsive.onlyMobile}>{category.name} - </Responsive>
          {subcategory.name}
        </span>
      </Table.Cell>
      <Table.Cell>
        <Input fluid labelPosition="right" value={entry.plan}>
          <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
            Planned:
          </Responsive>
          <input />
          <Label>PLN</Label>
        </Input>
      </Table.Cell>
      <Table.Cell><Input fluid labelPosition="right" value={entry.real}>
        <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
          Real:
        </Responsive>
        <input />
        <Label>PLN</Label>
      </Input>
      </Table.Cell>
    </Table.Row>
  )
}
