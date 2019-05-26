import { connect } from 'react-redux'
import { addReceipt } from '../../expenses.actions'
import { Receipt } from '../../receipt.types'
import { AppState } from '../../../../app.store'
import { NewExpense } from './components/new-expense'

type DispatchProps = {
  addReceipt: (item: Receipt) => void
}

const mapDispatchToProps = {
  addReceipt,
}

const NewExpenseContainer = connect<{}, DispatchProps, {}, AppState>(null, mapDispatchToProps)(NewExpense)

export { NewExpenseContainer as NewExpense }
