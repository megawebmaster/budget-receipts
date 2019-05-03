import React from "react"
import { connect } from "react-redux"

import { AppState } from "../../../../app.store"
import { expensesMonth, expensesYear } from "../../../../routes"
import { Expenses } from "./expenses"

const mapStateToProps = (state: AppState) => ({
  year: expensesYear(state),
  month: expensesMonth(state),
})

const ExpensesContainer = connect(mapStateToProps)(Expenses)

export { ExpensesContainer as Expenses }
