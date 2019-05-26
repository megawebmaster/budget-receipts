import { connect } from "react-redux"

import { AppState } from "../../../../app.store"
import { expensesMonth, expensesYear } from "../../../../routes"
import { expensesLoading, expensesMessages } from '../../expenses.selectors'
import { Expenses } from "./expenses"

const mapStateToProps = (state: AppState) => ({
  year: expensesYear(state),
  month: expensesMonth(state),
  messages: expensesMessages(state),
  loading: expensesLoading(state),
})

const ExpensesContainer = connect(mapStateToProps)(Expenses)

export { ExpensesContainer as Expenses }
