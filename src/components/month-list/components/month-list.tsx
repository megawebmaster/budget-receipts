import React, { ComponentType, FC, Fragment, useCallback } from 'react'
import { NavLink, NavLinkProps } from 'redux-first-router-link'
import { Dropdown, DropdownItem, DropdownMenu, Menu, MenuItem, Responsive, Segment } from 'semantic-ui-react'
import { times } from 'ramda'
import { AvailableRoutes } from '../../../routes'

type MonthListProps = {
  route: AvailableRoutes,
  budget: string,
  year: number,
  month: number,
  showSpinner?: boolean,
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
  budget: string,
  year: number,
  children: (props: MonthItem) => JSX.Element
}

const MonthItems: FC<MonthItemsProps> = React.memo(
  ({ route, budget, year, children }) => (
    <Fragment>
      {times((month) => (
        children({
          month: month + 1,
          key: `month-${month + 1}`,
          as: NavLink,
          activeClassName: 'active',
          to: { type: route, payload: { budget, year, month: month + 1 } },
        })
      ), 12)}
    </Fragment>
  ),
)

export const MonthList: FC<MonthListProps> = React.memo(
  ({ route, budget, year, month, showSpinner = false }) => {
    const renderDropdownItem = useCallback(({ month, ...props }) => (
      <DropdownItem {...props}>Month {month}</DropdownItem>
    ), [])
    const renderMenuItem = useCallback(({ month, ...props }) => (
      <MenuItem {...props}>Month {month}</MenuItem>
    ), [])

    return (
      <Fragment>
        <Responsive
          as={Fragment}
          maxWidth={Responsive.onlyTablet.maxWidth}
        >
          <Dropdown text={`Expenses: month ${month}`} button fluid scrolling>
            <DropdownMenu>
              <MonthItems route={route} budget={budget} year={year}>
                {renderDropdownItem}
              </MonthItems>
            </DropdownMenu>
          </Dropdown>
          {showSpinner && <Segment basic loading size="mini" />}
        </Responsive>
        <Responsive
          as={Fragment}
          {...Responsive.onlyComputer}
        >
          <Menu vertical fluid>
            <MonthItems route={route} budget={budget} year={year}>
              {renderMenuItem}
            </MonthItems>
          </Menu>
        </Responsive>
      </Fragment>
    )
  },
)
