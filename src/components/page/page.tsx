import React, { FC, Fragment } from 'react'
import Link from 'redux-first-router-link'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Container, Menu } from 'semantic-ui-react'

import { AvailableRoutes, routes } from '../../routes/routes'
import { pages } from '../../routes/pages'

import styles from './page.module.css'

interface PageProps {
  location: AvailableRoutes
}

const PageMenu = () => (
  <Menu fixed="top" inverted>
    <Menu.Item header as={Link} to={routes[AvailableRoutes.HOME]}>SimplyBudget</Menu.Item>
    <Menu.Item as={Link} to={routes[AvailableRoutes.EXPENSES]}>Expenses</Menu.Item>
  </Menu>
)

export const Page: FC<PageProps> = ({ location }) => {
  const { component: Component } = pages[location]

  return (
    <Fragment>
      <PageMenu />
      <TransitionGroup component={null}>
        <CSSTransition
          key={location}
          classNames={{
            enter: styles['navigation-enter'],
            enterDone: styles['navigation-enter-done'],
            exit: styles['navigation-exit'],
          }}
          timeout={{ enter: 300, exit: 500 }}
          enter
          exit
          mountOnEnter
          unmountOnExit={false}
        >
          <Container fluid className={styles.container}>
            <Component />
          </Container>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  )
}
