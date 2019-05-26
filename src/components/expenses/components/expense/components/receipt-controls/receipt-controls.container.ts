import { AppState } from '../../../../../../app.store'
import { deleteReceipt, updateReceipt } from '../../../../expenses.actions'
import { connect } from 'react-redux'
import { ReceiptControlProps, ReceiptControls } from './receipt-controls'
import { Omit } from 'ramda'
import { Receipt } from '../../../../receipt.types'


type DispatchProps = {
  updateReceipt: (item: Receipt) => void
  deleteReceipt: (item: number) => void
}

const mapDispatchToProps = {
  updateReceipt,
  deleteReceipt,
}

const ReceiptControlsContainer = connect<{}, DispatchProps, Omit<ReceiptControlProps, keyof DispatchProps>, AppState>(null, mapDispatchToProps)(ReceiptControls)

export { ReceiptControlsContainer as ReceiptControls }
