import React, { FC, useCallback } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import { ExpandButton } from './expand-button'
import { Receipt } from '../../../../receipt.types'

export type ReceiptControlProps = {
  item: Receipt
  expanded: boolean
  processing: boolean
  setExpanded: (status: boolean) => void
  updateReceipt: (item: Receipt) => void
  deleteReceipt: (item: number) => void
}

export const ReceiptControls: FC<ReceiptControlProps> =
  ({ item, expanded, processing, setExpanded, updateReceipt, deleteReceipt }) => {
    const saveItem = useCallback(() => updateReceipt(item), [item, updateReceipt])
    const deleteItem = useCallback(() => deleteReceipt(item.id), [item.id, deleteReceipt])

    return (
      <ButtonGroup fluid>
        {!processing && <Button color="blue" icon="save" onClick={saveItem} />}
        {!processing && <Button color="red" icon="trash" onClick={deleteItem} />}
        {processing && <Button basic disabled loading />}
        <ExpandButton expanded={expanded} setExpanded={setExpanded} />
      </ButtonGroup>
    )
  }
