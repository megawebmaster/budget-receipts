import React, { FC, SyntheticEvent } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'
import { dropdownCategories } from '../../../../../categories'
import { useSelector } from 'react-redux'

export type CategoryFieldProps = {
  value?: number
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
}


export const CategoryField: FC<CategoryFieldProps> = ({ value, onChange }) => {
  const categories = useSelector(dropdownCategories)

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
    />
  )
}
