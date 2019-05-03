import React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { AppState } from "../../../app.store"
import { items } from "../expenses.selectors"
import { add } from "../expenses.actions"
import { Expenses } from "./expenses"

let id = 1

const mapStateToProps = (state: AppState) => ({
  items: items(state),
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addItem: () => dispatch(add(`test ${id++}`)),
})

const ExpensesContainer = connect(mapStateToProps, mapDispatchToProps)(Expenses)

export { ExpensesContainer as Expenses }
