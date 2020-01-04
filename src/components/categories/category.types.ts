export type CategoryType = 'income' | 'expense' | 'irregular' | 'saving'

export type Category = {
  id: number
  name: string
  type: CategoryType
  parent: Category | null
  createdAt: string
  startedAt: string
  deletedAt: string | null
  averageValues: string[]
  children?: Category[]
  saving?: boolean
}
