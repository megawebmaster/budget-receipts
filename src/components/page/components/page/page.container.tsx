import React from 'react'
import { connect } from 'react-redux'

import { location } from "../../../../routes"
import { AppState } from '../../../../app.store'
import { Page } from './page'

const mapStateToProps = (state: AppState) => ({
  location: location(state),
})

const PageContainer = connect(mapStateToProps)(Page)

export { PageContainer as Page }
