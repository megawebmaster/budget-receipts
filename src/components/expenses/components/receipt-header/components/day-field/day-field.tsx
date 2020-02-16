import React, { FC, useCallback, useEffect, useRef } from 'react'
import { Input } from 'semantic-ui-react'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import 'react-day-picker/lib/style.css'
import './day-field.css'
import { useSelector } from 'react-redux'
import { month as monthSelector, year as yearSelector } from '../../../../../../routes'

export type DayFieldProps = {
  addField: (input: HTMLInputElement | null) => void
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChange: (day: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  value: string
}

export const DayField: FC<DayFieldProps> = ({ addField, onBlur, onChange, onKeyDown, value }) => {
  const inputRef = useRef<Input>(null)
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

  const onFocus = useCallback(() => {
    inputRef.current?.select()
  }, [])

  useEffect(() => {
    const input = inputRef.current as any as { inputRef: React.MutableRefObject<HTMLInputElement> }
    addField(input.inputRef.current)
  }, [addField])

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
        onBlur,
        onKeyDown,
        fluid: true,
        onFocus: onFocus,
        ref: inputRef,
      }}
      dayPickerProps={{
        canChangeMonth: false,
        firstDayOfWeek: 1,
        locale: 'pl',
      }}
    />
  )
}
