import React, { FC, Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Container } from 'semantic-ui-react'

import { AvailableRoutes } from '../../../../routes'
import { pages } from '../../../../routes/pages'
import { PageMenu } from '../page-menu'

import styles from './page.module.css'

interface PageProps {
  location: AvailableRoutes
}

const transitionStyles = {
  enter: styles['navigation-enter'],
  enterDone: styles['navigation-enter-done'],
  exit: styles['navigation-exit'],
}
const transitionTimeouts = { enter: 300, exit: 500 }

export const Page: FC<PageProps> = React.memo(
  ({ location }) => {
    const { component: Component } = pages[location]

    return (
      <Fragment>
        <PageMenu />
        <TransitionGroup component={null}>
          <CSSTransition
            key={location}
            classNames={transitionStyles}
            timeout={transitionTimeouts}
            enter
            exit
            mountOnEnter
            unmountOnExit={false}
          >
            <div className={styles.container}>
              <Container fluid>
                <Component />
              </Container>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  },
)
