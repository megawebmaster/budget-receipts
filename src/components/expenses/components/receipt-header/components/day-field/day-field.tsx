import React, { FC, useCallback } from 'react'
import { Input } from 'semantic-ui-react'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import 'react-day-picker/lib/style.css'
import './day-field.css'
import { useSelector } from 'react-redux'
import { month as monthSelector, year as yearSelector } from '../../../../../../routes'

export type DayFieldProps = {
  value: string
  onChange: (day: string) => void
}


export const DayField: FC<DayFieldProps> = React.memo(
  ({ value, onChange }) => {
    const year = useSelector(yearSelector)
    const month = useSelector(monthSelector)

    const onDayChange = useCallback((day) => {
      if (day) {
        onChange(day.getDate().toString())
      }
    }, [onChange])
    const formatDate = useCallback((date) => date.getDate().toString(), [])
    const parseDate = useCallback((value) => {
      const day = parseInt(value, 10)

      if (day < 1 || day > 31) {
        return undefined
      }

      const date = new Date(year, month - 1, day)

      if (date.getMonth() !== month - 1) {
        return undefined
      }

      return date
    }, [year, month])

    return (
      <DayPickerInput
        component={Input}
        placeholder=""
        format="D"
        value={value}
        onDayChange={onDayChange}
        formatDate={formatDate}
        parseDate={parseDate}
        inputProps={{
          // disabled: this.props.disabled,
          // error: this.props.error,
          fluid: true,
        }}
        dayPickerProps={{
          canChangeMonth: false,
          firstDayOfWeek: 1,
          locale: 'pl',
        }}
      />
    )
  },
)
