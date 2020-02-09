import React, { FC, SyntheticEvent, useEffect, useRef } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import { dropdownCategories } from '../../../../../categories'

export type CategoryFieldProps = {
  addField: (input: HTMLInputElement | null) => void
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  value?: number | string
}

export const CategoryField: FC<CategoryFieldProps> = ({ addField, onChange, onKeyDown, value }) => {
  const categories = useSelector(dropdownCategories)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const dropdown = dropdownRef.current as any as { searchRef: React.MutableRefObject<HTMLInputElement> }
    addField(dropdown.searchRef.current)
  }, [addField])

  return (
    <Dropdown
      fluid
      selection
      search
      value={value}
      options={categories}
      openOnFocus={false}
      placeholder="Select category…"
      // error={error}
      // disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      ref={dropdownRef}
    />
  )
}
