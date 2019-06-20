import { connect } from 'react-redux'
import { AppState } from '../../../../../../app.store'
import { processingImage } from '../../../../expenses.selectors'
import { PhotoButton } from './photo-button'

type StateProps = {
  processingImage: boolean
}

const mapStateToProps = (state: AppState) => ({
  processingImage: processingImage(state),
})

const PhotoButtonContainer = connect<StateProps, {}, {}, AppState>(mapStateToProps)(PhotoButton)

export { PhotoButtonContainer as PhotoButton }
