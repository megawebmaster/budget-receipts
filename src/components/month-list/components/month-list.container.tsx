import { connect } from "react-redux"

import { AppState } from "../../../app.store"
import { expensesMonth, expensesYear } from "../../../routes"
import { MonthList } from "./month-list"

const mapStateToProps = (state: AppState) => ({
  year: expensesYear(state),
  month: expensesMonth(state),
})

const MonthListContainer = connect(mapStateToProps)(MonthList)

export { MonthListContainer as MonthList }
