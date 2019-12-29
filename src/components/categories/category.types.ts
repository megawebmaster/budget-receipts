export type Category = {
  id: number
  name: string
  type: 'income' | 'expense' | 'irregular' | 'saving'
  parent: Category | null
  createdAt: string
  startedAt: string
  deletedAt: string | null
  averageValues: string[]
  children?: Category[]
}
