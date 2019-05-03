import React from "react"
import { connect } from "react-redux"

import { AppState } from "../../../app.store"
import { expensesMonth, expensesYear } from "../../../routes/routes.selectors"
import { MonthList } from "./month-list"

const mapStateToProps = (state: AppState) => ({
  year: expensesYear(state),
  month: expensesMonth(state),
})

const MonthListContainer = connect(mapStateToProps)(MonthList)

export { MonthListContainer as MonthList }
