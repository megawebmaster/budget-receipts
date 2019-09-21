import { Receipt, ReceiptItem as ItemType } from '../../../../receipt.types'
import { DeleteReceiptItem, UpdateReceiptItem } from '../../../../expenses.actions'
import React, { FC, useCallback } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'

type ItemButtonsProps = {
  item: ItemType
  receipt: Receipt
  deleteItem: (item: DeleteReceiptItem) => void
  updateItem: (item: UpdateReceiptItem) => void
}

export const ItemButtons: FC<ItemButtonsProps> = ({ receipt: { id, processing }, item, updateItem, deleteItem }) => {
  const save = useCallback(() => updateItem({ id, itemId: item.id, value: item }), [id, item, updateItem])
  const remove = useCallback(() => deleteItem({ id, itemId: item.id }), [id, item, deleteItem])

  return (
    <ButtonGroup fluid>
      <Button icon="save" color="blue" disabled={processing || false} onClick={save} />
      <Button icon="trash" color="red" disabled={processing || false} onClick={remove} />
    </ButtonGroup>
  )
}
