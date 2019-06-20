import { connect } from 'react-redux'
import { AppState } from '../../../../../../app.store'
import { processReceiptImage } from '../../../../expenses.actions'
import { Camera } from './camera'

type DispatchProps = {
  processImage: (photo: Blob) => void
}

type OwnProps = {
  close: () => void
  visible: boolean
}

const mapDispatchToProps = {
  processImage: processReceiptImage,
}

const CameraContainer = connect<{}, DispatchProps, OwnProps, AppState>(null, mapDispatchToProps)(Camera)

export { CameraContainer as Camera }
