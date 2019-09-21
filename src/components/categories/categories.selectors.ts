import { createSelector } from 'reselect'
import { DropdownItemProps } from 'semantic-ui-react'

import { AppState } from '../../app.store'

export const categories = (state: AppState) => state.categories
export const dropdownCategories = createSelector(
  categories,
  (categories): DropdownItemProps[] => categories.map(category => ({ text: category.name, value: category.id })),
)
