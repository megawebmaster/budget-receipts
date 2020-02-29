import React, { useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Container } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

import { Selectors as RouteSelectors } from '../../../../routes'
import { pages } from '../../../../routes/pages'
import { loadBudgets } from '../../page.actions'
import { PasswordRequirement } from '../../../password-requirement'
import { Selectors as AuthSelectors } from '../../../../auth'
import { PageMenu } from '../page-menu/page-menu'

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
  const dispatch = useDispatch()

  const { component: Component, requiresPassword, requiresLogin } = pages[location]

  useEffect(() => {
    dispatch(loadBudgets())
  }, [dispatch])

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
