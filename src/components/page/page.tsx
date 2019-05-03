import React, { FC, Fragment } from "react"
import Link, { NavLink } from "redux-first-router-link"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Container, Menu } from "semantic-ui-react"

import { AvailableRoutes } from "../../routes/routes"
import { pages } from "../../routes/pages"

import styles from "./page.module.css"

interface PageProps {
  location: AvailableRoutes
}

const PageMenu = () => (
  <Menu fixed="top" inverted>
    <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
    <Menu.Item
      as={NavLink}
      to={{ type: AvailableRoutes.EXPENSES, payload: { year: 2019, month: 1 } }}
      activeClassName="active"
    >
      Expenses
    </Menu.Item>
  </Menu>
)

export const Page: FC<PageProps> = ({ location }) => {
  const { component: Component } = pages[location]

  return (
    <Fragment>
      <PageMenu/>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location}
          classNames={{
            enter: styles["navigation-enter"],
            enterDone: styles["navigation-enter-done"],
            exit: styles["navigation-exit"],
          }}
          timeout={{ enter: 300, exit: 500 }}
          enter
          exit
          mountOnEnter
          unmountOnExit={false}
        >
          <div className={styles.container}>
            <Container fluid>
              <Component/>
            </Container>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  )
}
