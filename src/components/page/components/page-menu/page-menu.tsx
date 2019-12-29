import React, { Fragment, useCallback } from 'react'
import Link, { NavLink } from 'redux-first-router-link'
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react'

import { AvailableRoutes } from '../../../../routes'
import { useSelector } from 'react-redux'
import { budgets, budgetsLoading, currentBudget as currentBudgetSelector } from '../../page.selectors'

const year = new Date().getFullYear();

export const PageMenu = React.memo(
  () => {
    const currentBudget = useSelector(currentBudgetSelector)
    const loading = useSelector(budgetsLoading)
    const availableBudgets = useSelector(budgets)

    const onLogout = useCallback(() => console.log('click!'), [])

    return (
      <Menu fixed="top" inverted>
        <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
        <Menu.Item
          as={NavLink}
          to={{ type: AvailableRoutes.BUDGET, payload: { year, budget: 'domowy' } }}
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
                      to={{ type: AvailableRoutes.BUDGET, payload: { budget: budget.slug, year } }}
                    />
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
      </Menu>
    )
  },
)
