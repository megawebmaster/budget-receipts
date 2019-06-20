import { connect } from 'react-redux'
import { AppState } from '../../../../../../app.store'
import { processReceiptImage } from '../../../../expenses.actions'
import { processingImage } from '../../../../expenses.selectors'
import { PhotoButton } from './photo-button'

type StateProps = {
  processingImage: boolean
}
type DispatchProps = {
  processImage: (photo: Blob) => void
}

const mapStateToProps = (state: AppState) => ({
  processingImage: processingImage(state),
})

const mapDispatchToProps = {
  processImage: processReceiptImage,
}

const PhotoButtonContainer = connect<StateProps, DispatchProps, {}, AppState>(mapStateToProps, mapDispatchToProps)(PhotoButton)

export { PhotoButtonContainer as PhotoButton }
