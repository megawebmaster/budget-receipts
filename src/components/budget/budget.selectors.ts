import { createSelector, Selector } from 'reselect'
import { AppState } from '../../app.store'
import { CategoryType } from '../categories'
import { AvailableRoutes, Selectors as RouteSelectors } from '../../routes'
import { BudgetEntry, BudgetEntryValueType } from './budget-entry.types'

export const budgetLoading = (state: AppState) => state.budget.loading || state.categories.loading
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


const reduceBudgetType = (type: BudgetEntryValueType, entries: BudgetEntry[]) => (
  entries.reduce((result, entry) => result + (typeof entry[type] === 'number' ? entry[type] : 0.0), 0.0)
)

export const createSummarySelector = (type: CategoryType, entryType: BudgetEntryValueType) =>
  createSelector(entries[type], reduceBudgetType.bind(null, entryType))

export const createCategoryEntrySelector = (categoryId: number): Selector<AppState, BudgetEntry> =>
  createSelector(
    budgetEntries,
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
            id: categoryId
          }
        }
      ) as BudgetEntry,
  )

export const createPlannedValueDisabledSelector = (type: CategoryType) => createSelector(
  [RouteSelectors.location],
  (location) => location !== AvailableRoutes.BUDGET_IRREGULAR && type === 'irregular'
)
export const createRealValueDisabledSelector = (type: CategoryType) =>
  () => type === 'irregular' || type === 'expense'
