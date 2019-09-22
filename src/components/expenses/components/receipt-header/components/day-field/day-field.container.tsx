import { connect, Omit } from "react-redux"

import { AppState } from '../../../../../../app.store'
import { expensesMonth, expensesYear } from '../../../../../../routes'

import { DayField, DayFieldProps } from './day-field'

type StateProps = {
  year: number
  month: number
}

const mapStateToProps = (state: AppState) => ({
  year: expensesYear(state),
  month: expensesMonth(state),
})

const DayFieldContainer = connect<StateProps, {}, Omit<DayFieldProps, keyof StateProps>, AppState>(
  mapStateToProps
)(DayField)

export { DayFieldContainer as DayField }
