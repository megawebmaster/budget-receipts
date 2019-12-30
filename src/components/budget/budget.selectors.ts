import { createSelector, Selector } from 'reselect'
import { AppState } from '../../app.store'
import { CategoryType } from '../categories'
import { BudgetEntry } from './budget-entry.types'

export const budgetLoading = (state: AppState) => state.budget.loading
export const budgetEntries = (state: AppState) => state.budget.entries

const createBudgetSelector = (type: CategoryType) =>
  createSelector(
    [budgetEntries],
    entries => entries.filter(entry => entry.category.type === type)
  )

const entries: Record<CategoryType, Selector<AppState, BudgetEntry[]>> = {
  income: createBudgetSelector('income'),
  expense: createBudgetSelector('expense'),
  irregular: createBudgetSelector('irregular'),
  saving: createBudgetSelector('saving'),
}

type EntryValueType = 'plan' | 'real'

const reduceBudgetType = (type: EntryValueType, entries: BudgetEntry[]) => (
  entries.reduce((result, entry) => result + (typeof entry[type] === 'number' ? entry[type] : 0.0), 0.0)
)

export const createSummarySelector = (type: CategoryType, entryType: EntryValueType) =>
  createSelector(entries[type], reduceBudgetType.bind(null, entryType))

export const createCategoryEntrySelector = (type: CategoryType, categoryId: number): Selector<AppState, BudgetEntry> =>
  createSelector(
    entries[type],
    (entries) =>
      entries.find(entry => entry.category.id === categoryId) ||
      entries.filter(entry => entry.category.parent?.id === categoryId).reduce(
        (result, entry) => ({
          ...result,
          plan: result.plan + entry.plan,
          real: result.real + entry.real,
        }),
        {
          plan: 0,
          real: 0,
          category: {
            type,
            id: categoryId
          }
        }
      ) as BudgetEntry,
  )

