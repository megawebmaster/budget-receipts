import React, { FC } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'

import { Receipt, ReceiptItem } from '../../../../receipt.types'
import { DeleteReceiptItem } from '../../../../expenses.actions'

type ItemButtonsProps = {
  deleteItem: (item: DeleteReceiptItem) => void
  itemId: ReceiptItem['id']
  receipt: Receipt
}

export const ItemButtons: FC<ItemButtonsProps> = ({ deleteItem, itemId, receipt: { id, processing } }) => {
  const remove = () => deleteItem({ id, itemId })

  return (
    <ButtonGroup fluid>
      <Button icon="trash" color="red" disabled={processing || false} onClick={remove} />
    </ButtonGroup>
  )
}
