import { connect } from "react-redux"

import { AppState } from "../../../app.store"
import { budget, month, year } from '../../../routes'
import { MonthList } from "./month-list"

// TODO: Refactor to useSelector
const mapStateToProps = (state: AppState) => ({
  budget: budget(state) || 'no-budget',
  year: year(state),
  month: month(state),
})

const MonthListContainer = connect(mapStateToProps)(MonthList)

export { MonthListContainer as MonthList }
