import { createSelector } from 'reselect'
import { DropdownItemProps } from 'semantic-ui-react'

import { AppState } from '../../app.store'
import { month, year } from '../../routes'

import { Category } from './category.types'

export const categories = (state: AppState) => state.categories
export const dropdownCategories = createSelector(
  categories,
  (categories): DropdownItemProps[] => categories.map(category => ({ text: category.name, value: category.id })),
)

const accessibleCategories = createSelector(
  [year, month, categories],
  (year, month, categories) => categories.filter(category => {
    const started = new Date(category.startedAt);
    const startMatched = category.startedAt === null || (
      started.getFullYear() <= year && started.getMonth() + 1 <= month
    );
    const deleted = new Date(category.deletedAt || '');
    const deletionMatched = category.deletedAt === null || (
      deleted.getFullYear() > year || deleted.getMonth() + 1 > month
    );

    return startMatched && deletionMatched;
  })
);

const parseChildrenCategories = (categories: Category[]) => {
  const mainCategories = categories.filter(category => category.parent === null);
  mainCategories.forEach(category => {
    category.children = categories.filter(c => c.parent && c.parent.id === category.id);
  });
  return mainCategories;
};

export const incomeCategories = createSelector(
  [accessibleCategories],
  (categories) => parseChildrenCategories(categories.filter(category => category.type === 'income'))
);

export const expensesCategories = createSelector(
  [accessibleCategories],
  (categories) => parseChildrenCategories(categories.filter(category => category.type === 'expense'))
);

const yearCategories = createSelector(
  [year, categories],
  (year, categories) => categories.filter(category => {
    const started = new Date(category.startedAt);

    return (category.startedAt === null || started.getFullYear() === year) && category.deletedAt === null;
  })
);

export const irregularCategories = createSelector(
  [yearCategories],
  (categories) => {
    console.log('irregular', categories)
    return parseChildrenCategories(categories.filter(category => category.type === 'irregular'))
  }
);

export const savingsCategories = createSelector(
  [accessibleCategories],
  (categories) => parseChildrenCategories(categories.filter(category => category.type === 'saving'))
);
