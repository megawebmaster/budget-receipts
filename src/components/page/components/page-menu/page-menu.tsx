import React from 'react'
import Link, { NavLink } from 'redux-first-router-link'
import { Menu } from 'semantic-ui-react'

import { AvailableRoutes } from '../../../../routes'

const year = new Date().getFullYear();

export const PageMenu = React.memo(
  () => (
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
    </Menu>
  ),
)
