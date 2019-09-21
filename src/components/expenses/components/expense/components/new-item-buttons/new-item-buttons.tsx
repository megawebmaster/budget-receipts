import { Receipt, ReceiptItem as ItemType } from "../../../../receipt.types";
import { AddReceiptItem } from "../../../../expenses.actions";
import React, { FC } from "react";
import { Button } from "semantic-ui-react";

type NewItemButtonsProps = {
  item: ItemType
  receipt: Receipt
  reset: () => void
    addItem: (item: AddReceiptItem) => void
}

export const NewItemButtons: FC<NewItemButtonsProps> = React.memo(
  ({ receipt: { id }, item, reset, addItem }) => (
    <Button fluid icon="plus" color="green" onClick={() => {
      addItem({ id, value: item })
      reset()
    }} />
  ),
)
