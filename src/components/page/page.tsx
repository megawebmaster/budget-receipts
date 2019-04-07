import React, { FC, Fragment } from 'react'
import Link from 'redux-first-router-link'
import { Container, Menu, Segment } from 'semantic-ui-react'

import { AvailableRoutes, routes } from '../../routes/routes'
import { pages } from '../../routes/pages'

import styles from './page.module.css'

interface PageProps {
  location: AvailableRoutes
}

export const Page: FC<PageProps> = ({ location }) => {
  const { component: Component } = pages[location]

  return (
    <Fragment>
      <Menu fixed="top" inverted>
        <Menu.Item header as={Link} to={routes[AvailableRoutes.HOME]}>SimplyBudget</Menu.Item>
        <Menu.Item as={Link} to={routes[AvailableRoutes.EXPENSES]}>Expenses</Menu.Item>
      </Menu>
      <Container fluid className={styles.container}>
        <Component />
      </Container>
    </Fragment>
  )
}
