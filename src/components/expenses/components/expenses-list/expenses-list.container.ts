import { connect } from "react-redux"
import { ExpensesList } from "./expenses-list"
import { AppState } from "../../../../app.store"
import { expensesReceipts } from "../../expenses.selectors"

const mapStateToProps = (state: AppState) => ({
  receipts: expensesReceipts(state),
})

const ExpensesListContainer = connect(mapStateToProps)(ExpensesList)

export { ExpensesListContainer as ExpensesList }
