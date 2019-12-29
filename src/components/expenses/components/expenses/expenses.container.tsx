import { connect } from "react-redux"

import { AppState } from "../../../../app.store"
import { month, year } from "../../../../routes"
import { expensesLoading, expensesMessages } from '../../expenses.selectors'
import { Expenses } from "./expenses"

const mapStateToProps = (state: AppState) => ({
  year: year(state),
  month: month(state),
  messages: expensesMessages(state),
  loading: expensesLoading(state),
})

const ExpensesContainer = connect(mapStateToProps)(Expenses)

export { ExpensesContainer as Expenses }
