import { connect } from 'react-redux'

import { AppState } from '../../../../app.store'
import { Budget } from './budget'
import { budgetLoading, budgetMessages } from '../../budget.selectors'
import { budgetMonth, budgetYear } from '../../../../routes'

const mapStateToProps = (state: AppState) => ({
  year: budgetYear(state),
  month: budgetMonth(state),
  messages: budgetMessages(state),
  loading: budgetLoading(state),
})

const BudgetContainer = connect(mapStateToProps)(Budget)

export { BudgetContainer as Budget }
