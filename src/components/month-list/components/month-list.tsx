import React, { ComponentType, FC, Fragment } from "react"
import { NavLink, NavLinkProps } from "redux-first-router-link"
import { Dropdown, DropdownItem, DropdownMenu, Menu, MenuItem, Responsive } from "semantic-ui-react"
import { flip, times as originalTimes } from "ramda"
import { AvailableRoutes } from "../../../routes"

type MonthListProps = {
  route: AvailableRoutes,
  year: number,
  month: number,
}

type MonthItem = {
  month: number,
  key: string,
  as: ComponentType<NavLinkProps>,
  activeClassName: string,
  to: object,
}

type MonthItemsProps = {
  route: AvailableRoutes,
  year: number,
  children: (props: MonthItem) => JSX.Element
}

const times = flip(originalTimes)

const MonthItems: FC<MonthItemsProps> = ({ route, year, children }) => (
  <Fragment>
    {times(12, (month) => (
      children({
        month: month + 1,
        key: `month-${month + 1}`,
        as: NavLink,
        activeClassName: "active",
        to: { type: route, payload: { year, month: month + 1 } },
      })
    ))}
  </Fragment>
)

export const MonthList: FC<MonthListProps> = ({ route, year, month }) => (
  <Fragment>
    <Responsive
      as={Fragment}
      maxWidth={Responsive.onlyTablet.maxWidth}
    >
      <Dropdown text={`Expenses: month ${month}`} button fluid>
        <DropdownMenu>
          <MonthItems route={route} year={year}>
            {({ month, ...props }) => (
              <DropdownItem {...props}>Month {month}</DropdownItem>
            )}
          </MonthItems>
        </DropdownMenu>
      </Dropdown>
    </Responsive>
    <Responsive
      as={Fragment}
      {...Responsive.onlyComputer}
    >
      <Menu vertical fluid>
        <MonthItems route={route} year={year}>
          {({ month, ...props }) => (
            <MenuItem {...props}>Month {month}</MenuItem>
          )}
        </MonthItems>
      </Menu>
    </Responsive>
  </Fragment>
)

