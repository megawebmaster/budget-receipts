import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Divider, Header, Loader } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

import { NewExpense, SavedExpense } from '../expense'
import { expensesLoading, expensesReceipts } from '../../expenses.selectors'

import styles from './expenses-list.module.css'

export const ExpensesList = () => {
  const receipts = useSelector(expensesReceipts)
  const loading = useSelector(expensesLoading)

  return (
    <Fragment>
      {loading && (
        <Divider horizontal>
          <Header as="h6">
            <Loader active inline className={styles.dividerLoader} size="tiny" />
            <FormattedMessage id="expenses.loading-new-items" />
          </Header>
        </Divider>
      )}
      <NewExpense />
      {receipts.map(receipt => (
        <SavedExpense key={receipt.id} receipt={receipt} />
      ))}
    </Fragment>
  )
}
