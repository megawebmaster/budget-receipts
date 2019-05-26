import React, { FC, Fragment, useCallback } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import { ExpandButton } from './expand-button'

export type ReceiptControlProps = {
  id: number
  expanded: boolean
  setExpanded: (status: boolean) => void
  deleteReceipt: (item: number) => void
}

export const ReceiptControls: FC<ReceiptControlProps> = ({ id, expanded, setExpanded, deleteReceipt }) => {
  const deleteItem = useCallback(() => deleteReceipt(id), [id, deleteReceipt])

  return (
    <Fragment>
      <ButtonGroup fluid>
        {expanded && <Button color="blue" icon="save" />}
        {expanded && <Button color="red" icon="trash" onClick={deleteItem} />}
        <ExpandButton expanded={expanded} setExpanded={setExpanded} />
      </ButtonGroup>
    </Fragment>
  )
}
