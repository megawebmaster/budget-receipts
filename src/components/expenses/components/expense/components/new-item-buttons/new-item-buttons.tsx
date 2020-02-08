import React, { FC } from 'react'
import { Button } from 'semantic-ui-react'

import { NewReceiptItem } from '../../../../receipt.types'

type NewItemButtonsProps = {
  addItem: (item: NewReceiptItem) => void
  item: NewReceiptItem
  reset: () => void
}

export const NewItemButtons: FC<NewItemButtonsProps> = ({ addItem, item, reset }) => (
  <Button fluid icon="plus" color="green" onClick={() => {
    addItem(item)
    reset()
  }} />
)
