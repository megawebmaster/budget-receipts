import React, { FC, SyntheticEvent, useCallback, useEffect, useRef } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import { dropdownCategories } from '../../../../../categories'

export type CategoryFieldProps = {
  addField: (input: HTMLInputElement | null) => void
  onBlur?: () => void
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, value: any) => void
  value?: number | string
}

export const CategoryField: FC<CategoryFieldProps> = ({ addField, onBlur, onChange, onKeyDown, value }) => {
  const categories = useSelector(dropdownCategories)
  const dropdownRef = useRef(null)

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown(event, event.currentTarget.value)
  }, [onKeyDown])

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
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      ref={dropdownRef}
    />
  )
}
