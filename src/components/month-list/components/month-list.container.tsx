import { connect } from "react-redux"

import { AppState } from "../../../app.store"
import { expensesBudget, expensesMonth, expensesYear } from '../../../routes'
import { MonthList } from "./month-list"

const mapStateToProps = (state: AppState) => ({
  budget: expensesBudget(state) || 'no-budget',
  year: expensesYear(state),
  month: expensesMonth(state),
})

const MonthListContainer = connect(mapStateToProps)(MonthList)

export { MonthListContainer as MonthList }
