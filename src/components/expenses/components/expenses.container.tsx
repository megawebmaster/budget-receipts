import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../../../app.store'
import { items } from '../expenses.selectors'
import { add } from '../expenses.actions'
import { Expenses, ExpensesProps } from './expenses'

let id = 1

type StateProps = Pick<ExpensesProps, 'items'>
type DispatchProps = Pick<ExpensesProps, 'addItem'>

const mapStateToProps = (state: AppState) => ({
  items: items(state),
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addItem: () => dispatch(add(`test ${id++}`)),
})

const ExpensesContainer = connect<StateProps, DispatchProps, {}, AppState>(mapStateToProps, mapDispatchToProps)(Expenses)

export { ExpensesContainer as Expenses }
