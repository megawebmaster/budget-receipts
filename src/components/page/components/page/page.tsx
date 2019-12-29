import React, { Fragment, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Container } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

import { location as locationSelector } from '../../../../routes'
import { pages } from '../../../../routes/pages'
import { loadBudgets } from '../../page.actions'
import { PageMenu } from '../page-menu'

import styles from './page.module.css'

const transitionStyles = {
  enter: styles['navigation-enter'],
  enterDone: styles['navigation-enter-done'],
  exit: styles['navigation-exit'],
}
const transitionTimeouts = { enter: 300, exit: 500 }

export const Page = React.memo(
  () => {
    const location = useSelector(locationSelector)
    const dispatch = useDispatch()
    const { component: Component } = pages[location]

    useEffect(() => {
      dispatch(loadBudgets())
    }, [])

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
