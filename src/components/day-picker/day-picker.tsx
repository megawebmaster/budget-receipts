import React, { useCallback } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { Input } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { Selectors as RouteSelectors } from '../../routes'
import { DayPickerInputProps } from 'react-day-picker/types/Props'

const formatDate = (date: Date) => date.getDate().toString()

export const DayPicker = React.forwardRef(({ inputProps, onDayChange, value, ...props }: Omit<DayPickerInputProps, 'component'>, ref) => {
  const { year, month } = useSelector(RouteSelectors.budgetParams)
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
        ...inputProps,
        fluid: true,
        ref,
      }}
      dayPickerProps={{
        canChangeMonth: false,
        firstDayOfWeek: 1,
        initialMonth: new Date(year, month - 1),
        locale: 'pl',
      }}
      {...props}
    />
  )
})
