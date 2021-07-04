import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import * as Actions from '../../../expenses.actions'
import { DayPicker } from '../../../../day-picker/day-picker'
import { Label } from 'semantic-ui-react'
import { createFilterSelector } from '../../../expenses.selectors'

export const DayFilter = () => {
  const dispatch = useDispatch()
  const valueSelector = useMemo(() => createFilterSelector('day'), [])
  const value = useSelector(valueSelector)

  const handleChange = (day: Date) => {
    dispatch(Actions.setFilter({ field: 'day', value: day ? day.getDate() : '' }))
  }

  return (
    <>
      <Label>
        <FormattedMessage id="expenses.filters.day" />
      </Label>
      <DayPicker
        clickUnselectsDay
        onDayChange={handleChange}
        value={value.toString()}
      />
    </>
  )
}
