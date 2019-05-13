import { connect } from "react-redux"
import { Expense } from "./expense"
import { addReceiptItem, deleteReceiptItem } from "../../expenses.actions"
import { Receipt, ReceiptItem } from "../../receipt"

type DispatchProps = {
  addItem: (item: { id: number, value: ReceiptItem }) => void,
  deleteItem: (item: { id: number, itemId: number }) => void,
}

const mapDispatchToProps = {
  addItem: addReceiptItem,
  deleteItem: deleteReceiptItem,
}

const ExpenseContainer = connect<Receipt, DispatchProps>(null, mapDispatchToProps)(Expense)

export { ExpenseContainer as Expense }
