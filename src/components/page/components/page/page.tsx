import React, { useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Container } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

import { location as locationSelector } from '../../../../routes'
import { pages } from '../../../../routes/pages'
import { loadBudgets } from '../../page.actions'
import { PageMenu } from '../page-menu/page-menu'
import { PasswordRequirement } from '../../../password-requirement'
import { isLoggedIn as isLoggedInSelector, login } from '../../../../auth'

import styles from './page.module.css'

const transitionStyles = {
  enter: styles['navigation-enter'],
  enterDone: styles['navigation-enter-done'],
  exit: styles['navigation-exit'],
}
const transitionTimeouts = { enter: 300, exit: 500 }

export const Page = () => {
  const location = useSelector(locationSelector)
  const isLoggedIn = useSelector(isLoggedInSelector)
  const dispatch = useDispatch()

  const { component: Component, requiresPassword, requiresLogin } = pages[location]

  useEffect(() => {
    if (requiresLogin && !isLoggedIn) {
      dispatch(login())
    } else {
      dispatch(loadBudgets())
    }
  }, [dispatch, requiresLogin, isLoggedIn])

  if (requiresLogin && !isLoggedIn) {
    return null;
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
