import { createStandardAction } from 'typesafe-actions'

export const add = createStandardAction('EXPEnSES/add')<string>()
export const reset = createStandardAction('EXPEnSES/update').map(
  (title: string) => ({
    payload: {
      title,
      updatedAt: new Date(),
    },
  }),
)
