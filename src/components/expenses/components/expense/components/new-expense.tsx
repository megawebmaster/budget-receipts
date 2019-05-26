import React, { FC, useCallback, useState } from 'react'
import { Button, ButtonGroup, Grid, Responsive, Segment } from 'semantic-ui-react'
import { ReceiptHeader } from '../../receipt-header'
import { Receipt } from '../../../receipt.types'

import styles from '../expense.module.css'

const emptyReceipt = (): Receipt => ({
  id: Date.now(),
  date: new Date().getDate(),
  shop: '',
})

type NewReceiptProps = {
  addReceipt: (item: Receipt) => void
}

// TODO: Add support for taking photos
export const NewExpense: FC<NewReceiptProps> = React.memo(
  ({ addReceipt }) => {
    const [item, setItem] = useState<Receipt>(emptyReceipt())

    const reset = useCallback(() => setItem(emptyReceipt()), [setItem])
    const update = useCallback((field, value) => {
      // @ts-ignore
      item[field] = value
    }, [item])

    const renderControls = useCallback(() => (
      <ButtonGroup fluid>
        <Button color="blue" icon="photo" />
        <Button.Or />
        <Button color="green" icon="plus" onClick={() => {
          addReceipt({ ...item, expanded: true })
          reset()
        }} />
      </ButtonGroup>
    ), [item, addReceipt, reset])

    return (
      <Grid as={Segment} className={styles.container}>
        <ReceiptHeader key={item.id} date={item.date.toString()} shop={item.shop} onUpdate={update}>
          {renderControls}
        </ReceiptHeader>
        <Responsive {...Responsive.onlyMobile} as={Grid.Column} width={16} className={styles.hideButton}>
          {renderControls()}
        </Responsive>
      </Grid>
    )
  },
)