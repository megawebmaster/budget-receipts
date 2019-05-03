import React, { ComponentType, FC, Fragment } from "react"
import { NavLink } from "redux-first-router-link"
import {
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownMenu,
  Menu,
  MenuItem,
  MenuItemProps,
  Responsive,
} from "semantic-ui-react"
import { flip, times as originalTimes } from "ramda"
import { AvailableRoutes } from "../../../routes/routes"

type BaseRoutePayload = {
  year: number
}

type BaseRoute = {
  type: AvailableRoutes,
  payload: BaseRoutePayload
}

type MonthListProps = {
  baseRoute: BaseRoute
}

type MonthItemsProps = {
  baseRoute: BaseRoute,
  as: ComponentType<MenuItemProps> | ComponentType<DropdownItemProps>
}

const times = flip(originalTimes)

const MonthItems: FC<MonthItemsProps> = ({ baseRoute, as: Component }) => (
  <Fragment>
    {times(12, (month) => (
      <Component
        key={`month-${month}`}
        name={`month-${month + 1}`}
        as={NavLink}
        activeClassName="active"
        to={{ ...baseRoute, payload: { ...baseRoute.payload, month: month + 1 } }}
      >
        {month + 1}
      </Component>
    ))}
  </Fragment>
)

export const MonthList: FC<MonthListProps> = ({ baseRoute }) => (
  <Fragment>
    <Responsive
      as={Fragment}
      {...Responsive.onlyMobile}
    >
      <Dropdown
        text={`Month 1`}
        button
        fluid
      >
        <DropdownMenu>
          <MonthItems baseRoute={baseRoute} as={DropdownItem}/>
        </DropdownMenu>
      </Dropdown>
    </Responsive>
    <Responsive
      minWidth={Responsive.onlyTablet.minWidth}
      as={Menu}
      vertical
      fluid
    >
      <MonthItems baseRoute={baseRoute} as={MenuItem}/>
    </Responsive>
  </Fragment>
)

