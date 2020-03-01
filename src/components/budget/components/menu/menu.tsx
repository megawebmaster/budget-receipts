import React, { FC } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { times } from 'ramda'

import { AvailableRoutes, Selectors as RouteSelectors } from '../../../../routes'
import { ResponsiveMenu } from '../../../responsive-menu'

type MenuProps = {
  label: (year: string, month: string) => string
}

export const Menu: FC<MenuProps> = ({ label, children }) => {
  const intl = useIntl()
  const budget = useSelector(RouteSelectors.budget)
  const year = useSelector(RouteSelectors.year)
  const month = useSelector(RouteSelectors.month)

  const dropdownLabel = label(year.toString(), intl.formatMessage({ id: `month-${month}` }))
  const items = [
    {
      id: 'first',
      items: [{
        id: 'irregular',
        route: { type: AvailableRoutes.BUDGET_IRREGULAR, payload: { budget, year } },
        text: intl.formatMessage({ id: `budget.irregular.menu` }),
      }]
    },
    {
      id: 'second',
      items: times((month) => ({
        id: (month + 1).toString(),
        route: { type: AvailableRoutes.BUDGET_MONTH_ENTRIES, payload: { budget, year, month: month + 1 } },
        text: intl.formatMessage({ id: `month-${month + 1}`, defaultMessage: `Month ${month + 1}` }),
      }), 12)
    },
  ]

  return (
    <ResponsiveMenu items={items} label={dropdownLabel}>
      {children}
    </ResponsiveMenu>
  )
}
