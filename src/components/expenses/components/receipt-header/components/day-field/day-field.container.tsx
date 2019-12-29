import { connect, Omit } from "react-redux"

import { AppState } from '../../../../../../app.store'
import { month, year } from '../../../../../../routes'

import { DayField, DayFieldProps } from './day-field'

type StateProps = {
  year: number
  month: number
}

const mapStateToProps = (state: AppState) => ({
  year: year(state),
  month: month(state),
})

const DayFieldContainer = connect<StateProps, {}, Omit<DayFieldProps, keyof StateProps>, AppState>(
  mapStateToProps
)(DayField)

export { DayFieldContainer as DayField }
