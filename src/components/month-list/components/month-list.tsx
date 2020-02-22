import React, { FC, Fragment, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'redux-first-router-link'
import { Dropdown, DropdownItem, DropdownMenu, Menu, MenuItem, Responsive } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { times } from 'ramda'

import {
  AvailableRoutes,
  budget as budgetSelector,
  month as monthSelector,
  year as yearSelector,
} from '../../../routes'

import styles from './month-list.module.css'

type MonthListProps = {
  route: AvailableRoutes
  label: string
  children: ReactNode
}

type MonthItemsProps = {
  route: AvailableRoutes,
  as: any
}

const MonthItems: FC<MonthItemsProps> = ({ route, as: Item }) => {
  const budget = useSelector(budgetSelector)
  const year = useSelector(yearSelector)

  return (
    <Fragment>
      {times((month) => (
        <Item
          key={`month-${month + 1}`}
          as={NavLink}
          activeClassName="active"
          to={{ type: route, payload: { budget, year, month: month + 1 } }}
        >
          <FormattedMessage id={`month-${month + 1}`} defaultMessage={`Month ${month + 1}`} />
        </Item>
      ), 12)}
    </Fragment>
  )
}

export const MonthList: FC<MonthListProps> = ({ route, label, children }) => {
  const month = useSelector(monthSelector)
  const year = useSelector(yearSelector)
  const intl = useIntl()

  return (
    <Fragment>
      <Responsive
        as="div"
        maxWidth={Responsive.onlyTablet.maxWidth}
        className={styles.dropdownContainer}
      >
        <Dropdown
          button
          fluid
          scrolling
          className={styles.dropdown}
          text={intl.formatMessage(
            { id: 'month-list.dropdown-label' },
            { label, year, month: intl.formatMessage({ id: `month-${month + 1}` }) },
          )}
        >
          <DropdownMenu>
            <MonthItems route={route} as={DropdownItem} />
          </DropdownMenu>
        </Dropdown>
        {children}
      </Responsive>
      <Responsive
        as={Fragment}
        {...Responsive.onlyComputer}
      >
        <Menu vertical fluid>
          <MonthItems route={route} as={MenuItem} />
        </Menu>
      </Responsive>
    </Fragment>
  )
}
