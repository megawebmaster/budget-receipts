import { Category } from '../categories'

export type BudgetEntryValueType = 'plan' | 'real'

export type BudgetEntry = {
  id: number
  category: Pick<Category, 'id' | 'type' | 'parent'>
  month: number
  plan: number
  real: number
  monthlyRealValues: string[]
}
