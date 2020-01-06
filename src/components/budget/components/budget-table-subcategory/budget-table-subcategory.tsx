import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Responsive, Table } from 'semantic-ui-react'

import { CurrencyInput } from '../../../currency-input'
import { CategoryType, createCategorySelector, deleteCategory, updateCategory } from '../../../categories'
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
    const entrySelector = useMemo(() => createCategoryEntrySelector(subcategoryId), [subcategoryId])

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
    const editCategory = useCallback(
      (name: string) => dispatch(updateCategory({ name, id: subcategoryId })),
      [dispatch, subcategoryId],
    )
    const removeCategory = useCallback(
      () => dispatch(deleteCategory({ id: subcategoryId, type: categoryType })),
      [dispatch, subcategoryId, categoryType],
    )

    if (!category || !subcategory) {
      return null
    }

    const saving = Boolean(subcategory.saving)

    return (
      <Table.Row>
        <Table.Cell>
          <EditableText
            editable={editable}
            saving={saving}
            value={subcategory.name}
            onDelete={removeCategory}
            onSave={editCategory}
          >
            <Responsive as={Fragment} {...Responsive.onlyMobile}>{category.name} - </Responsive>
            {subcategory.name}
          </EditableText>
        </Table.Cell>
        <Table.Cell>
          <CurrencyInput
            currency="PLN"
            disabled={loading || saving}
            label="Planned"
            value={entry.plan}
            onUpdate={updatePlanned}
          />
        </Table.Cell>
        <Table.Cell>
          <CurrencyInput
            currency="PLN"
            disabled={loading || saving}
            label="Real"
            value={entry.real}
            onUpdate={updateReal}
          />
        </Table.Cell>
      </Table.Row>
    )
  }
