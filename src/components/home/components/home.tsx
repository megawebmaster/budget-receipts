import React, { Fragment } from 'react'
import { Container, Header } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import Helmet from 'react-helmet'

import { MessageList } from '../../message-list'

import styles from './home.module.css'

export const Home = () => (
  <Fragment>
    <Helmet>
      <title>Home - Simply Budget Receipts</title>
    </Helmet>
    <MessageList />
    <Container text className={styles.container}>
      <Header as="h1">
        <FormattedMessage id="landing.header" />
      </Header>
      <p>
        <FormattedMessage id="landing.text" />
      </p>
    </Container>
  </Fragment>
)
