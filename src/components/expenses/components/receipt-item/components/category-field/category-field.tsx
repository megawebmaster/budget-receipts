import React, { FC, SyntheticEvent, useCallback } from 'react'
import { Dropdown, DropdownItemProps, DropdownProps, DropdownSearchInput } from 'semantic-ui-react'
import { dropdownCategories } from '../../../../../categories'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../../../app.store'

export type CategoryFieldProps = {
  value?: number
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
}


export const CategoryField: FC<CategoryFieldProps> = React.memo(
  ({ value, onChange }) => {
    const blockKeyDown = useCallback((event: SyntheticEvent) => event.stopPropagation(), [])
    const categories = useSelector<AppState, DropdownItemProps[]>(dropdownCategories)

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
        searchInput={<DropdownSearchInput onKeyDown={blockKeyDown} />}
      />
    )
  },
)
