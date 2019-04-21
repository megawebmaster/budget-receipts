import { createStandardAction } from 'typesafe-actions'

export const add = createStandardAction('EXPENSES/add')<string>()
export const reset = createStandardAction('EXPENSES/update').map(
  (title: string) => ({
    payload: {
      title,
      updatedAt: new Date(),
    },
  }),
)
