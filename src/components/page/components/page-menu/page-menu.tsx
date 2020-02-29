import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import Link, { NavLink } from 'redux-first-router-link'
import { Button, Dropdown, Icon, Menu, Responsive, Segment } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { AvailableRoutes, Selectors as RouteSelectors } from '../../../../routes'
import * as PageSelectors from '../../page.selectors'

import styles from './page-menu.module.css'

export const PageMenu = () => {
  const intl = useIntl()
  const currentBudget = useSelector(PageSelectors.currentBudget)
  const loadingBudgets = useSelector(PageSelectors.budgetsLoading)
  const loadingYears = useSelector(PageSelectors.budgetYearsLoading)
  const availableBudgets = useSelector(PageSelectors.budgets)
  const years = useSelector(PageSelectors.budgetYears)
  const year = useSelector(RouteSelectors.year)
  const month = useSelector(RouteSelectors.month)
  const budget = useSelector(RouteSelectors.budget)
  const yearChangeRoute = useSelector(RouteSelectors.yearByLocation)

  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = useCallback(() => setExpanded(value => !value), [setExpanded])

  const onLogout = useCallback(() => console.log('click!'), [])

  return (
    <Fragment>
      <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Menu} fixed="top" inverted>
        <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
        <Menu.Item
          as={NavLink}
          to={{ type: AvailableRoutes.BUDGET_MONTH_ENTRIES, payload: { year, month, budget } }}
          activeClassName="active"
        >
          <FormattedMessage id="menu.budget" />
        </Menu.Item>
        <Menu.Item
          as={NavLink}
          to={{ type: AvailableRoutes.EXPENSES_MONTH, payload: { year, month, budget } }}
          activeClassName="active"
        >
          <FormattedMessage id="menu.expenses" />
        </Menu.Item>
        <Menu.Menu position="right">
          <Dropdown
            item
            loading={loadingYears}
            text={`${intl.formatMessage({ id: 'menu.year' }, { year })}`}
          >
            <Dropdown.Menu>
              {years.map(y =>
                <Dropdown.Item
                  key={`year-${y}`}
                  text={y}
                  as={NavLink}
                  to={{ type: yearChangeRoute, payload: { budget, year: y } }}
                />,
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            item
            loading={loadingBudgets}
            text={currentBudget ? currentBudget.name : ''}
          >
            <Dropdown.Menu>
              <Dropdown.Header>
                <FormattedMessage id="menu.your-budgets" />
              </Dropdown.Header>
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
            <FormattedMessage id="menu.logout" />
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
              <FormattedMessage id="menu.budget" />
            </Menu.Item>
            <Menu.Item
              as={NavLink}
              to={{ type: AvailableRoutes.EXPENSES, payload: { year, budget: 'domowy' } }}
              activeClassName="active"
              onClick={toggleExpanded}
            >
              <FormattedMessage id="menu.expenses" />
            </Menu.Item>
            <Menu.Item>
              <FormattedMessage id="menu.available-years" />
              {loadingYears && (
                <Segment basic loading size="tiny" floated="right" className={styles.loader} />
              )}
              <Menu.Menu>
                {years && years.map(y => (
                  <Menu.Item
                    key={`year-${y}`}
                    as={NavLink}
                    to={{ type: yearChangeRoute, payload: { budget, year: y } }}
                    activeClassName="active"
                    onClick={toggleExpanded}
                  >
                    {y}
                  </Menu.Item>
                ))}
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
              {loadingBudgets && (
                <Segment basic loading size="tiny" floated="right" className={styles.loader} />
              )}
              <FormattedMessage id="menu.your-budgets" />
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
            <Menu.Item icon="power" content={intl.formatMessage({ id: 'menu.logout' })} onClick={onLogout} />
          </Menu>
        )}
      </Responsive>
    </Fragment>
  )
}
