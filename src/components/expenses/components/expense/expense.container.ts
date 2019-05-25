import { connect } from 'react-redux'
import { Expense } from './components/expense'
import {
  AddReceiptItem,
  addReceiptItem,
  DeleteReceiptItem,
  deleteReceiptItem,
  updateReceiptItem,
  UpdateReceiptItem,
} from '../../expenses.actions'
import { Receipt, ReceiptItem } from '../../receipt.types'
import { expenseItems } from '../../expenses.selectors'
import { AppState } from '../../../../app.store'

type StateProps = {
  items: ReceiptItem[]
}

const mapStateToProps = (state: AppState, { id }: Receipt) => ({
  items: expenseItems(state, id),
})

type DispatchProps = {
  addItem: (item: AddReceiptItem) => void,
  updateItem: (item: UpdateReceiptItem) => void,
  deleteItem: (item: DeleteReceiptItem) => void,
}

const mapDispatchToProps = {
  addItem: addReceiptItem,
  updateItem: updateReceiptItem,
  deleteItem: deleteReceiptItem,
}

const ExpenseContainer = connect<StateProps, DispatchProps, Receipt, AppState>(mapStateToProps, mapDispatchToProps)(Expense)

export { ExpenseContainer as Expense }
