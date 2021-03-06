import React, { FC, SyntheticEvent, useEffect, useMemo, useRef } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'

import { Selectors as CategorySelectors } from '../../../../../categories'

export type CategoryFieldProps = {
  addField: (input: HTMLInputElement | null) => void
  onBlur?: (value: number) => void
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, value: any) => void
  value?: number | string
}

export const CategoryField: FC<CategoryFieldProps> = ({ addField, onBlur, onChange, onKeyDown, value }) => {
  const intl = useIntl()
  const categoriesSelector = useMemo(
    () => CategorySelectors.createDropdownCategoriesSelector(
      intl.formatMessage({ id: 'budget.irregular.category' })
    ),
    [intl],
  )
  const categories = useSelector(categoriesSelector)
  const dropdownRef = useRef(null)

  const handleChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    onChange(event, data)
    if (onBlur) {
      onBlur(data.value as number)
    }
  }

  useEffect(() => {
    const dropdown = dropdownRef.current as any as { searchRef: React.MutableRefObject<HTMLInputElement> }
    addField(dropdown.searchRef.current)
  }, [addField])

  return (
    <Dropdown
      fluid
      search
      selection
      selectOnBlur
      value={value}
      options={categories}
      openOnFocus={false}
      // error={error}
      // disabled={disabled}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={intl.formatMessage({ id: 'expenses.category' })}
      ref={dropdownRef}
    />
  )
}
