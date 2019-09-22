import { connect } from 'react-redux'
import { Expense } from './components/expense'
import {
  AddReceiptItem,
  addReceiptItem,
  DeleteReceiptItem,
  deleteReceiptItem,
  updateReceipt,
  updateReceiptItem,
  UpdateReceiptItem,
} from '../../expenses.actions'
import { Receipt, ReceiptItem } from '../../receipt.types'
import { expenseItems } from '../../expenses.selectors'
import { AppState } from '../../../../app.store'

type StateProps = {
  items: ReceiptItem[]
}

const mapStateToProps = (state: AppState, { receipt }: OwnProps) => ({
  items: expenseItems(state, receipt.id),
})

type DispatchProps = {
  onSave: (receipt: Receipt) => void,
  addItem: (item: AddReceiptItem) => void,
  updateItem: (item: UpdateReceiptItem) => void,
  deleteItem: (item: DeleteReceiptItem) => void,
}

const mapDispatchToProps = {
  onSave: updateReceipt,
  addItem: addReceiptItem,
  updateItem: updateReceiptItem,
  deleteItem: deleteReceiptItem,
}

type OwnProps = {
  receipt: Receipt
}

const ExpenseContainer = connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(Expense)

export { ExpenseContainer as Expense }
