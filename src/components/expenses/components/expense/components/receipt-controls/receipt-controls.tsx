import React, { FC, useCallback } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import { ExpandButton } from './expand-button'
import { Receipt } from '../../../../receipt.types'

export type ReceiptControlProps = {
  item: Receipt
  expanded: boolean
  setExpanded: (status: boolean) => void
  updateReceipt: (item: Receipt) => void
  deleteReceipt: (item: number) => void
}

export const ReceiptControls: FC<ReceiptControlProps> = ({ item, expanded, setExpanded, updateReceipt, deleteReceipt }) => {
  const saveItem = useCallback(() => updateReceipt(item), [item, updateReceipt])
  const deleteItem = useCallback(() => deleteReceipt(item.id), [item.id, deleteReceipt])

  return (
    <ButtonGroup fluid>
      {expanded && <Button color="blue" icon="save" onClick={saveItem} />}
      {expanded && <Button color="red" icon="trash" onClick={deleteItem} />}
      <ExpandButton expanded={expanded} setExpanded={setExpanded} />
    </ButtonGroup>
  )
}
