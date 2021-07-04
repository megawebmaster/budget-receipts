import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown, DropdownProps, Label } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import * as Actions from '../../../expenses.actions'
import { Selectors as CategorySelectors } from '../../../../categories'
import { createItemFilterSelector } from '../../../expenses.selectors'

export const CategoryFilter = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const categoriesSelector = useMemo(
    () => CategorySelectors.createDropdownCategoriesSelector(
      intl.formatMessage({ id: 'budget.irregular.category' }),
    ),
    [intl],
  )
  const categories = useSelector(categoriesSelector)
  const valueSelector = useMemo(() => createItemFilterSelector('categoryId'), [])
  const value = useSelector(valueSelector)

  const handleChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    const value = data.value as string[] ?? []
    dispatch(Actions.setItemFilter({ field: 'categoryId', value }))
  }

  return (
    <>
      <Label>
        <FormattedMessage id="expenses.filters.category" />
      </Label>
      <Dropdown
        clearable
        fluid
        multiple
        options={categories}
        onChange={handleChange}
        search
        selection
        selectOnBlur
        value={value}
      />
    </>
  )
}
