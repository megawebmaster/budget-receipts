import { createSelector, Selector } from 'reselect'
import { DropdownItemProps } from 'semantic-ui-react'

import { AppState } from '../../app.store'
import { Selectors as RouteSelectors } from '../../routes'

import { Category, CategoryType } from './category.types'

export const accessibleCategories = createSelector(
  [RouteSelectors.year, RouteSelectors.month, (state: AppState) => state.categories.categories],
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
  [RouteSelectors.year, (state: AppState) => state.categories.categories],
  (year, categories) => categories.filter(category => {
    const started = new Date(category.startedAt)

    return (category.startedAt === null || started.getFullYear() === year) && category.deletedAt === null
  }),
)

const createCategoriesSelector =
  (categoriesSelector: Selector<AppState, Category[]>, type: CategoryType): Selector<AppState, Category[]> =>
    createSelector(
      [categoriesSelector],
      (categories) => categories.filter(category => !category.parent && category.type === type),
    )

export const categories: Record<CategoryType, Selector<AppState, Category[]>> = {
  income: createCategoriesSelector(accessibleCategories, 'income'),
  expense: createCategoriesSelector(accessibleCategories, 'expense'),
  irregular: createCategoriesSelector(yearCategories, 'irregular'),
  saving: createCategoriesSelector(accessibleCategories, 'saving'),
}

export const receiptCategories = createSelector(
  [categories.expense, categories.irregular],
  (expenseCategories, irregularCategories): Category[] =>
    flattenCategories(expenseCategories).concat(flattenCategories(irregularCategories)),
)

const flattenCategories = (categories: Category[]): Category[] =>
  categories.flatMap(category =>
    category.children && category.children.length > 0 ? category.children : [category],
  )

export const hasIrregularCategories = createSelector(
  [categories.irregular],
  (irregularCategories) => irregularCategories.length > 0,
)

export const hasVisibleCategories = createSelector(
  [accessibleCategories, yearCategories],
  (regularCategories, yearlyCategories) => regularCategories.length > 0 || yearlyCategories.length > 0,
)

export const createCategorySelector = (categoryId: number) =>
  createSelector(
    [accessibleCategories],
    (categories) => categories.find(category => category.id === categoryId) || null,
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

export const createDropdownCategoriesSelector = (irregularLabel: string) => createSelector(
  [categories.expense, categories.irregular],
  (expenseCategories, irregularCategories): DropdownItemProps[] => [
    ...mapDropdownCategories(expenseCategories),
    ...mapDropdownCategories(irregularCategories, irregularLabel),
  ].sort((a, b) => a.text.localeCompare(b.text)),
)
