import React, { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup } from 'semantic-ui-react'

import { ExpandButton } from './expand-button'
import { Receipt } from '../../../../receipt.types'
import { deleteReceipt } from '../../../../expenses.actions'

export type ReceiptControlProps = {
  expanded: boolean
  item: Receipt
  processing: boolean
  setExpanded: (status: boolean) => void
}

export const ReceiptControls: FC<ReceiptControlProps> =
  ({ expanded, item, processing, setExpanded }) => {
    const dispatch = useDispatch()
    const deleteItem = useCallback(() => dispatch(deleteReceipt(item.id)), [item.id, dispatch])

    return (
      <ButtonGroup fluid>
        {!processing && <Button color="red" icon="trash" onClick={deleteItem} />}
        {processing && <Button basic disabled loading />}
        <ExpandButton expanded={expanded} setExpanded={setExpanded} />
      </ButtonGroup>
    )
  }
