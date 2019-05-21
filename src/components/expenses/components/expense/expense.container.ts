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
import { Receipt } from '../../receipt'

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

const ExpenseContainer = connect<Receipt, DispatchProps>(null, mapDispatchToProps)(Expense)

export { ExpenseContainer as Expense }
