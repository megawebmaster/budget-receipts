import { AppState } from '../../../../../../app.store'
import { deleteReceipt } from '../../../../expenses.actions'
import { connect } from 'react-redux'
import { ReceiptControlProps, ReceiptControls } from './receipt-controls'
import { Omit } from 'ramda'


type DispatchProps = {
  deleteReceipt: (item: number) => void,
}

const mapDispatchToProps = {
  deleteReceipt,
}

const ReceiptControlsContainer = connect<{}, DispatchProps, Omit<ReceiptControlProps, keyof DispatchProps>, AppState>(null, mapDispatchToProps)(ReceiptControls)

export { ReceiptControlsContainer as ReceiptControls }
