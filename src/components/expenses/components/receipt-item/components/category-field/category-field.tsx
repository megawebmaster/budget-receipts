import React, { FC, SyntheticEvent, useCallback, useEffect, useRef } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { dropdownCategories } from '../../../../../categories'
import { useSelector } from 'react-redux'

export type CategoryFieldProps = {
  addField: (input: HTMLInputElement | null) => void
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
  value?: number | string
}


export const CategoryField: FC<CategoryFieldProps> = ({ addField, onChange, value }) => {
  const categories = useSelector(dropdownCategories)
  const dropdownRef = useRef(null)

  const blockKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.stopPropagation()
      event.preventDefault()
    }
  }, [])

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
      onKeyDown={blockKeyDown}
      ref={dropdownRef}
    />
  )
}
