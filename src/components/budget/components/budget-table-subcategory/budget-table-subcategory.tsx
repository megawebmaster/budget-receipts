import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Responsive, Table } from 'semantic-ui-react'
import { useIntl } from 'react-intl'

import { CurrencyInput } from '../../../currency-input'
import { Actions as CategoryActions, CategoryType, Selectors as CategorySelectors } from '../../../categories'
import {
  budgetLoading,
  createCategoryEntrySelector,
  plannedValueDisabled,
  realValueDisabled,
} from '../../budget.selectors'
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
    const intl = useIntl()
    const categorySelector = useMemo(() => CategorySelectors.createCategorySelector(categoryId), [categoryId])
    const subcategorySelector = useMemo(() => CategorySelectors.createCategorySelector(subcategoryId), [subcategoryId])
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
      (name: string) => dispatch(CategoryActions.updateCategory({ name, id: subcategoryId })),
      [dispatch, subcategoryId],
    )
    const removeCategory = useCallback(
      () => dispatch(CategoryActions.deleteCategory({ id: subcategoryId, type: categoryType })),
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
            disabled={loading || saving || plannedValueDisabled(categoryType)}
            label={intl.formatMessage({ id: 'budget.table.planned' })}
            value={entry.plan}
            onUpdate={updatePlanned}
          />
        </Table.Cell>
        <Table.Cell>
          <CurrencyInput
            currency="PLN"
            disabled={loading || saving || realValueDisabled(categoryType)}
            label={intl.formatMessage({ id: 'budget.table.real' })}
            value={entry.real}
            onUpdate={updateReal}
          />
        </Table.Cell>
      </Table.Row>
    )
  }
