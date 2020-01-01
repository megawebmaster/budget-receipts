import React, { Fragment, useCallback, useState } from 'react'
import Link, { NavLink } from 'redux-first-router-link'
import { Button, Dropdown, Icon, Menu, Responsive, Segment } from 'semantic-ui-react'

import { AvailableRoutes } from '../../../../routes'
import { useSelector } from 'react-redux'
import { budgets, budgetsLoading, currentBudget as currentBudgetSelector } from '../../page.selectors'

import styles from './page-menu.module.css'

const year = new Date().getFullYear()

export const PageMenu = React.memo(
  () => {
    const currentBudget = useSelector(currentBudgetSelector)
    const loading = useSelector(budgetsLoading)
    const availableBudgets = useSelector(budgets)

    const [expanded, setExpanded] = useState(false)
    const toggleExpanded = useCallback(() => setExpanded(value => !value), [setExpanded])

    const onLogout = useCallback(() => console.log('click!'), [])

    return (
      <Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Menu} fixed="top" inverted>
          <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
          <Menu.Item
            as={NavLink}
            to={{ type: AvailableRoutes.BUDGET_ENTRIES, payload: { year, budget: 'domowy' } }}
            activeClassName="active"
          >
            Budget
          </Menu.Item>
          <Menu.Item
            as={NavLink}
            to={{ type: AvailableRoutes.EXPENSES, payload: { year, budget: 'domowy' } }}
            activeClassName="active"
          >
            Expenses
          </Menu.Item>
          <Menu.Menu position="right">}
            <Dropdown
              item
              loading={loading}
              text={currentBudget ? currentBudget.name : ''}
            >
              <Dropdown.Menu>
                <Dropdown.Header>Your budgets</Dropdown.Header>
                {availableBudgets && (
                  <Fragment>
                    {availableBudgets.map(budget =>
                      <Dropdown.Item
                        key={`budget-${budget.id}`}
                        text={budget.name}
                        as={Link}
                        to={{ type: AvailableRoutes.BUDGET, payload: { budget: budget.slug } }}
                      />,
                    )}
                  </Fragment>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item name="logout" as={Button} onClick={onLogout}>
              <Icon name="power" />
              Log out
            </Menu.Item>
          </Menu.Menu>
        </Responsive>
        <Responsive {...Responsive.onlyMobile} as={Fragment}>
          <Menu fixed="top" inverted>
            <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
            <Menu.Item position="right" onClick={toggleExpanded}>
              <Icon name={expanded ? 'times' : 'bars'} />
            </Menu.Item>
          </Menu>
          {expanded && (
            <Menu fixed="top" inverted vertical fluid className={styles.secondaryMenu}>
              <Menu.Item
                as={NavLink}
                to={{ type: AvailableRoutes.BUDGET_ENTRIES, payload: { year, budget: 'domowy' } }}
                activeClassName="active"
                onClick={toggleExpanded}
              >
                Budget
              </Menu.Item>
              <Menu.Item
                as={NavLink}
                to={{ type: AvailableRoutes.EXPENSES, payload: { year, budget: 'domowy' } }}
                activeClassName="active"
                onClick={toggleExpanded}
              >
                Expenses
              </Menu.Item>
              <Menu.Item>
                Your budgets
                {loading && (
                  <Segment loading size="tiny" />
                )}
                <Menu.Menu>
                  {availableBudgets && availableBudgets.map(budget => (
                    <Menu.Item
                      key={`budget-${budget.id}`}
                      as={NavLink}
                      to={{ type: AvailableRoutes.BUDGET, payload: { budget: budget.slug } }}
                      activeClassName="active"
                      onClick={toggleExpanded}
                    >
                      {budget.name}
                    </Menu.Item>
                  ))}
                </Menu.Menu>
              </Menu.Item>
              <Menu.Item icon="power" content="Log out" onClick={onLogout} />
            </Menu>
          )}
        </Responsive>
      </Fragment>
    )
  },
)
