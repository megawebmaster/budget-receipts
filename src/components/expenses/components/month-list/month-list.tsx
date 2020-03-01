import React, { FC } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { times } from 'ramda'

import { AvailableRoutes, Selectors as RouteSelectors } from '../../../../routes'
import { ResponsiveMenu } from '../../../responsive-menu'

export const MonthList: FC = ({ children }) => {
  const intl = useIntl()
  const budget = useSelector(RouteSelectors.budget)
  const year = useSelector(RouteSelectors.year)
  const month = useSelector(RouteSelectors.month)

  const dropdownLabel = intl.formatMessage(
    { id: 'month-list.dropdown-label' },
    {
      year,
      label: intl.formatMessage({ id: 'expenses.month-header' }),
      month: intl.formatMessage({ id: `month-${month}` }),
    },
  )
  const items = [
    {
      id: 'only',
      items: times((item) => ({
        id: (item + 1).toString(),
        route: { type: AvailableRoutes.EXPENSES_MONTH, payload: { budget, year, month: item + 1 } },
        text: intl.formatMessage({ id: `month-${item + 1}`, defaultMessage: `Month ${item + 1}` }),
      }), 12),
    },
  ]

  return (
    <ResponsiveMenu items={items} label={dropdownLabel}>
      {children}
    </ResponsiveMenu>
  )
}
