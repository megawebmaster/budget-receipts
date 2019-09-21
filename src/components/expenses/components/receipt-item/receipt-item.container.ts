import { connect } from 'react-redux'
import { ReceiptItem } from './receipt-item'
import { AppState } from '../../../../app.store'
import { dropdownCategories } from '../../../categories'

const mapStateToProps = (state: AppState) => ({
  categories: dropdownCategories(state),
})

const ReceiptItemContainer = connect(mapStateToProps)(ReceiptItem)

export { ReceiptItemContainer as ReceiptItem }
