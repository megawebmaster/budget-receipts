import React, { FC } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'

import { ChangeReceiptItem, Receipt, ReceiptItem } from '../../../../receipt.types'
import { DeleteReceiptItem, UpdateReceiptItem } from '../../../../expenses.actions'

type ItemButtonsProps = {
  deleteItem: (item: DeleteReceiptItem) => void
  itemId: ReceiptItem['id']
  item: ChangeReceiptItem
  receipt: Receipt
  updateItem: (item: UpdateReceiptItem) => void
}

export const ItemButtons: FC<ItemButtonsProps> = ({ deleteItem, itemId, item, receipt: { id, processing }, updateItem }) => {
  const save = () => updateItem({ id, itemId, value: item })
  const remove = () => deleteItem({ id, itemId })

  return (
    <ButtonGroup fluid>
      <Button icon="save" color="blue" disabled={processing || false} onClick={save} />
      <Button icon="trash" color="red" disabled={processing || false} onClick={remove} />
    </ButtonGroup>
  )
}
