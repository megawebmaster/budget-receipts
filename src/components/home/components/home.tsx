import React, { Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import Helmet from 'react-helmet'

export const Home = () => (
  <Fragment>
    <Helmet>
      <title>Home - Simply Budget Receipts</title>
    </Helmet>
    <Header as="h1">
      <FormattedMessage id="app.header" />
    </Header>
    <p>This is a home page, loaded by default</p>
  </Fragment>
)
