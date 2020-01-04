import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Responsive, Table } from 'semantic-ui-react'

import { CurrencyInput } from '../../../currency-input'
import { CategoryType, createCategorySelector } from '../../../categories'
import { budgetLoading, createCategoryEntrySelector } from '../../budget.selectors'
import { updateEntry } from '../../budget.actions'
import { EditableText } from '../editable-text'


type BudgetTableSubcategoryProps = {
  categoryId: number
  categoryType: CategoryType
  editable: boolean
  subcategoryId: number
}

// TODO: Navigable table
export const BudgetTableSubcategory: FC<BudgetTableSubcategoryProps> =
  ({ categoryType, categoryId, editable, subcategoryId }) => {
    const categorySelector = useMemo(() => createCategorySelector(categoryId), [categoryId])
    const subcategorySelector = useMemo(() => createCategorySelector(subcategoryId), [subcategoryId])
    const entrySelector = useMemo(() =>
      createCategoryEntrySelector(categoryType, subcategoryId), [categoryType, subcategoryId]
    )

    const category = useSelector(categorySelector)
    const subcategory = useSelector(subcategorySelector)
    const entry = useSelector(entrySelector)
    const loading = useSelector(budgetLoading)

    const dispatch = useDispatch()
    const updatePlanned = useCallback(
      (value: number) => dispatch(updateEntry({ value, categoryId: subcategoryId, type: 'plan' })),
      [dispatch, subcategoryId],
    )
    const updateReal = useCallback(
      (value: number) => dispatch(updateEntry({ value, categoryId: subcategoryId, type: 'real' })),
      [dispatch, subcategoryId],
    )

    if (!category || !subcategory) {
      return null
    }

    return (
      <Table.Row>
        <Table.Cell>
          <EditableText
            editable={editable}
            saving={false}
            value={subcategory.name}
            onDelete={() => null}
            onSave={() => null}
          >
            <Responsive as={Fragment} {...Responsive.onlyMobile}>{category.name} - </Responsive>
            {subcategory.name}
          </EditableText>
        </Table.Cell>
        <Table.Cell>
          <CurrencyInput label="Planned" value={entry.plan} currency="PLN" disabled={loading}
                         onUpdate={updatePlanned} />
        </Table.Cell>
        <Table.Cell>
          <CurrencyInput label="Real" value={entry.real} currency="PLN" disabled={loading} onUpdate={updateReal} />
        </Table.Cell>
      </Table.Row>
    )
  }
