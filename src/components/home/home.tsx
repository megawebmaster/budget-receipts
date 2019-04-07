import React, { Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

export const Home = () => (
  <Fragment>
    <Header as="h1">
      <FormattedMessage id="app.header" />
    </Header>
    <p>This is a home page, loaded by default</p>
  </Fragment>
)
