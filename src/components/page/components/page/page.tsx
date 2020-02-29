import React, { useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Container, Dimmer, Loader } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

import { Selectors as RouteSelectors } from '../../../../routes'
import { pages } from '../../../../routes/pages'
import { PageMenu } from '../page-menu/page-menu'
import { PasswordRequirement } from '../../../password-requirement'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../../../auth'
import * as Actions from '../../page.actions'

import styles from './page.module.css'

const transitionStyles = {
  enter: styles['navigation-enter'],
  enterDone: styles['navigation-enter-done'],
  exit: styles['navigation-exit'],
}
const transitionTimeouts = { enter: 300, exit: 500 }

export const Page = () => {
  const location = useSelector(RouteSelectors.location)
  const isLoggedIn = useSelector(AuthSelectors.isLoggedIn)
  const isLoggingIn = useSelector(AuthSelectors.isLoggingIn)
  const dispatch = useDispatch()

  const { component: Component, requiresPassword, requiresLogin } = pages[location]

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(Actions.loadBudgets())
    }
  }, [dispatch, isLoggedIn])

  useEffect(() => {
    if (requiresLogin && !isLoggingIn && !isLoggedIn) {
      dispatch(AuthActions.login())
    }
  }, [dispatch, isLoggingIn, isLoggedIn, requiresLogin])

  if (isLoggingIn) {
    return (
      <Dimmer active inverted>
        <Loader inverted />
      </Dimmer>
    )
  }

  if (requiresLogin && !isLoggedIn) {
    return null
  }

  return (
    <PasswordRequirement required={requiresPassword}>
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
    </PasswordRequirement>
  )
}
