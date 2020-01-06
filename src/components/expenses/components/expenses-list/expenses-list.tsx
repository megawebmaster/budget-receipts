import React, { Fragment } from 'react'
import { NewExpense, SavedExpense } from '../expense'
import { useSelector } from 'react-redux'
import { expensesReceipts } from '../../expenses.selectors'

export const ExpensesList = () => {
  const receipts = useSelector(expensesReceipts)

  return (
    <Fragment>
      <NewExpense />
      {receipts.map(receipt => (
        <SavedExpense key={receipt.id} receipt={receipt} />
      ))}
    </Fragment>
  )
}
