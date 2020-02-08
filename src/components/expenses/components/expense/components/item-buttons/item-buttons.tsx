import React, { FC } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'

import { Receipt, ReceiptItem as ItemType } from '../../../../receipt.types'
import { DeleteReceiptItem, UpdateReceiptItem } from '../../../../expenses.actions'

type ItemButtonsProps = {
  deleteItem: (item: DeleteReceiptItem) => void
  item: ItemType
  receipt: Receipt
  updateItem: (item: UpdateReceiptItem) => void
}

export const ItemButtons: FC<ItemButtonsProps> = ({ deleteItem, item, receipt: { id, processing }, updateItem }) => {
  const save = () => updateItem({ id, itemId: item.id, value: item })
  const remove = () => deleteItem({ id, itemId: item.id })

  return (
    <ButtonGroup fluid>
      <Button icon="save" color="blue" disabled={processing || false} onClick={save} />
      <Button icon="trash" color="red" disabled={processing || false} onClick={remove} />
    </ButtonGroup>
  )
}
