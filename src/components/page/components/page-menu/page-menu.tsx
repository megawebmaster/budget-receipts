import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link, { NavLink } from 'redux-first-router-link'
import { Button, Dropdown, Icon, Menu, Responsive, Segment } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { AvailableRoutes, Selectors as RouteSelectors } from '../../../../routes'
import { Actions as AuthActions, Selectors as AuthSelectors } from '../../../../auth'
import * as PageSelectors from '../../page.selectors'

import styles from './page-menu.module.css'

const isMonthRoute = (location: AvailableRoutes) =>
  [AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.EXPENSES_MONTH].includes(location)

export const PageMenu = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const currentBudget = useSelector(PageSelectors.currentBudget)
  const loadingBudgets = useSelector(PageSelectors.budgetsLoading)
  const loadingYears = useSelector(PageSelectors.budgetYearsLoading)
  const availableBudgets = useSelector(PageSelectors.budgets)
  const years = useSelector(PageSelectors.budgetYears)
  const location = useSelector(RouteSelectors.location)
  const { budget, year, month } = useSelector(RouteSelectors.budgetParams)
  const yearChangeRoute = useSelector(RouteSelectors.yearByLocation)
  const isLoggedIn = useSelector(AuthSelectors.isLoggedIn)

  const [expanded, setExpanded] = useState(false)
  const budgetRoute = isMonthRoute(location)
    ? AvailableRoutes.BUDGET_MONTH_ENTRIES
    : AvailableRoutes.BUDGET_ENTRIES
  const expensesRoute = isMonthRoute(location)
    ? AvailableRoutes.EXPENSES_MONTH
    : AvailableRoutes.EXPENSES

  const toggleExpanded = () => setExpanded(value => !value)
  const onLogin = () => {
    window.location.hash = ''
    dispatch(AuthActions.login())
  }
  const onLogout = () => {
    dispatch(AuthActions.logout())
  }

  return (
    <Fragment>
      <Responsive minWidth={Responsive.onlyTablet.minWidth} as={Menu} fixed="top" inverted>
        <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
        {isLoggedIn ? (
            <Fragment>
              <Menu.Item
                as={NavLink}
                to={{ type: budgetRoute, payload: { year, month, budget } }}
                activeClassName="active"
              >
                <FormattedMessage id="menu.budget" />
              </Menu.Item>
              <Menu.Item
                as={NavLink}
                to={{ type: expensesRoute, payload: { year, month, budget } }}
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
            </Fragment>
          ) : (
          <Menu.Menu position="right">
            <Menu.Item name="login" as={Button} onClick={onLogin}>
              <FormattedMessage id="menu.login" />
            </Menu.Item>
          </Menu.Menu>
          )}
      </Responsive>
      <Responsive {...Responsive.onlyMobile} as={Fragment}>
        <Menu fixed="top" inverted>
          <Menu.Item header as={Link} to={{ type: AvailableRoutes.HOME }}>SimplyBudget</Menu.Item>
          { isLoggedIn ? (
            <Menu.Item position="right" onClick={toggleExpanded}>
              <Icon name={expanded ? 'times' : 'bars'} />
            </Menu.Item>
          ) : (
            <Menu.Item position="right" onClick={onLogin}>
              <FormattedMessage id="menu.login" />
            </Menu.Item>
          )}
        </Menu>
        {isLoggedIn && expanded && (
          <Menu fixed="top" inverted vertical fluid className={styles.secondaryMenu}>
            <Menu.Item
              as={NavLink}
              to={{ type: budgetRoute, payload: { year, month, budget } }}
              activeClassName="active"
              onClick={toggleExpanded}
            >
              <FormattedMessage id="menu.budget" />
            </Menu.Item>
            <Menu.Item
              as={NavLink}
              to={{ type: expensesRoute, payload: { year, month, budget } }}
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
