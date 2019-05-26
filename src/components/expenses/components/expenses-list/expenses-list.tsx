import React, { FC, Fragment } from 'react'
import { Expense, NewExpense } from '../expense'
import { Receipt } from '../../receipt.types'

type ExpensesListProps = {
  receipts: Receipt[]
}

export const ExpensesList: FC<ExpensesListProps> = ({ receipts }) => (
  <Fragment>
    {receipts.map(receipt => (
      <Expense key={receipt.id} id={receipt.id} date={receipt.date} shop={receipt.shop} expanded={receipt.expanded} />
    ))}
    <NewExpense />
  </Fragment>
)
