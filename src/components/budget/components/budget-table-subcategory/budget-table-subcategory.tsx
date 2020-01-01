import React, { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Responsive, Table } from 'semantic-ui-react'

import { CategoryType, createCategorySelector } from '../../../categories'
import { budgetLoading, createCategoryEntrySelector } from '../../budget.selectors'

import { CurrencyInput } from '../../../currency-input'

type BudgetTableSubcategoryProps = {
  categoryId: number
  subcategoryId: number
  categoryType: CategoryType
}

// TODO: Add value editing
// TODO: Extract input field
export const BudgetTableSubcategory: FC<BudgetTableSubcategoryProps> = ({ categoryType, categoryId, subcategoryId }) => {
  const categorySelector = useMemo(() => createCategorySelector(categoryId), [categoryId])
  const subcategorySelector = useMemo(() => createCategorySelector(subcategoryId), [subcategoryId])
  const entrySelector = useMemo(() => createCategoryEntrySelector(categoryType, subcategoryId), [categoryType, subcategoryId])

  const category = useSelector(categorySelector)
  const subcategory = useSelector(subcategorySelector)
  const entry = useSelector(entrySelector)
  const loading = useSelector(budgetLoading)

  const [plan, setPlan] = useState(entry.plan)
  const [real, setReal] = useState(entry.real)

  useEffect(() => {
    setPlan(entry.plan)
    setReal(entry.real)
  }, [setPlan, setReal, entry])

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
        <CurrencyInput label="Planned" value={plan} currency="PLN" disabled={loading} onUpdate={setPlan} />
      </Table.Cell>
      <Table.Cell>
        <CurrencyInput label="Real" value={real} currency="PLN" disabled={loading} onUpdate={setReal} />
      </Table.Cell>
    </Table.Row>
  )
}
