import { createSelector, Selector } from 'reselect'
import { DropdownItemProps } from 'semantic-ui-react'

import { AppState } from '../../app.store'
import { month, year } from '../../routes'

import { Category, CategoryType } from './category.types'

export const accessibleCategories = createSelector(
  [year, month, (state: AppState) => state.categories.categories],
  (year, month, categories) => categories.filter(category => {
    const started = new Date(category.startedAt)
    const startMatched = category.startedAt === null || (
      started.getFullYear() <= year && started.getMonth() + 1 <= month
    )
    const deleted = new Date(category.deletedAt || '')
    const deletionMatched = category.deletedAt === null || (
      deleted.getFullYear() > year || deleted.getMonth() + 1 > month
    )

    return startMatched && deletionMatched
  }),
)

const yearCategories = createSelector(
  [year, (state: AppState) => state.categories.categories],
  (year, categories) => categories.filter(category => {
    const started = new Date(category.startedAt)

    return (category.startedAt === null || started.getFullYear() === year) && category.deletedAt === null
  }),
)

const parseChildrenCategories = (categories: Category[]) => {
  const mainCategories = categories.filter(category => category.parent === null)
  mainCategories.forEach(category => {
    category.children = categories.filter(c => c.parent && c.parent.id === category.id)
  })
  return mainCategories
}

const createCategoriesSelector =
  (categoriesSelector: Selector<AppState, Category[]>, type: CategoryType): Selector<AppState, Category[]> =>
    createSelector(
      [categoriesSelector],
      (categories) => parseChildrenCategories(categories.filter(category => category.type === type)),
    )

export const categories: Record<CategoryType, Selector<AppState, Category[]>> = {
  income: createCategoriesSelector(accessibleCategories, 'income'),
  expense: createCategoriesSelector(accessibleCategories, 'expense'),
  irregular: createCategoriesSelector(yearCategories, 'irregular'),
  saving: createCategoriesSelector(accessibleCategories, 'saving'),
}

export const createCategorySelector = (categoryId: number) =>
  createSelector(
    [accessibleCategories],
    (categories) => categories.find(category => category.id === categoryId),
  )

const mapDropdownCategories = (categories: Category[], additionalLabel?: string) =>
  categories.flatMap(category =>
    category.children && category.children.length > 0
      ? category.children.map(subcategory => ({
        text: [additionalLabel, category.name, subcategory.name].filter(Boolean).join(' - '),
        value: subcategory.id,
      }))
      : {
        text: [additionalLabel, category.name].filter(Boolean).join(' - '),
        value: category.id,
      },
  )

// TODO: How to make `Nieregularne` translatable?
export const dropdownCategories = createSelector(
  [categories.expense, categories.irregular],
  (expenseCategories, irregularCategories): DropdownItemProps[] => [
    ...mapDropdownCategories(expenseCategories),
    ...mapDropdownCategories(irregularCategories, 'Nieregularne'),
  ].sort((a, b) => a.text.localeCompare(b.text)),
)
