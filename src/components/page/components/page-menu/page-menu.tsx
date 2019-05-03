import React from "react"
import Link, { NavLink } from "redux-first-router-link"
import { Menu } from "semantic-ui-react"

import { AvailableRoutes } from "../../../../routes"


export const PageMenu = () => (
  <Menu fixed="top" inverted>
    <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
    <Menu.Item
      as={NavLink}
      to={{ type: AvailableRoutes.EXPENSES, payload: { year: 2019 } }}
      activeClassName="active"
    >
      Expenses
    </Menu.Item>
  </Menu>
)
