import React, { FC, Fragment } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import { ExpandButton } from './expand-button'

export type ReceiptControlProps = {
  id: number
  expanded: boolean
  setExpanded: (status: boolean) => void
  deleteReceipt: (item: number) => void
}

export const ReceiptControls: FC<ReceiptControlProps> = ({ id, expanded, setExpanded, deleteReceipt }) => (
  <Fragment>
    <ButtonGroup fluid>
      {expanded && <Button color="blue" icon="save" />}
      {expanded && <Button color="red" icon="trash" onClick={() => deleteReceipt(id)} />}
      <ExpandButton expanded={expanded} setExpanded={setExpanded} />
    </ButtonGroup>
  </Fragment>
)
