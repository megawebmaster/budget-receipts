import { Category } from '../categories'

export type BudgetEntry = {
  id: number
  category: Pick<Category, 'id' | 'type'>
  month: number
  plan: string
  real: string
  monthlyRealValues: string[]
}
