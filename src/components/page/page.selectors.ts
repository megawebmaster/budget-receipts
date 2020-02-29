import { AppState } from '../../app.store'
import { createSelector } from 'reselect'
import { Selectors as RouteSelectors } from '../../routes'

export const budgets = (state: AppState) => state.page.budgets
export const budgetYears = (state: AppState) => state.page.years
export const budgetsLoading = (state: AppState) => state.page.loadingBudgets
export const budgetYearsLoading = (state: AppState) => state.page.loadingYears
export const pageMessages = (state: AppState) => state.page.messages

export const currentBudget = createSelector(
  [RouteSelectors.budget, budgets],
  (slug, budgets) => budgets.find(budget => budget.slug === slug)
)
