import React, { FC, SyntheticEvent, useCallback } from 'react'
import { Dropdown, DropdownItemProps, DropdownProps, DropdownSearchInput } from 'semantic-ui-react'

export type CategoryFieldProps = {
  value?: number
  categories: DropdownItemProps[]
  onChange: (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void
}


export const CategoryField: FC<CategoryFieldProps> = React.memo(
  ({ value, categories, onChange }) => {
    const blockKeyDown = useCallback((event: SyntheticEvent) => event.stopPropagation(), [])

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
