import { Category } from './category.types'

export const parseChildrenCategories = (categories: Category[]): Category[] => {
  return categories.map(category => ({
    ...category,
    children: categories.filter(c => c.parent && c.parent.id === category.id)
  }));
}
