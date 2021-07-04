import React, { FC, useCallback, useEffect, useRef } from 'react'
import { Input } from 'semantic-ui-react'

import { DayPicker } from '../../../../../day-picker/day-picker'

import 'react-day-picker/lib/style.css'
import './day-field.css'

export type DayFieldProps = {
  addField: (input: HTMLInputElement | null) => void
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChange: (day: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  value: string
}

export const DayField: FC<DayFieldProps> = ({ addField, onBlur, onChange, onKeyDown, value }) => {
  const inputRef = useRef<Input>(null)

  const onDayChange = useCallback((day) => {
    if (day) {
      onChange(day.getDate().toString())
    }
  }, [onChange])

  const onFocus = useCallback(() => {
    inputRef.current?.select()
  }, [])

  useEffect(() => {
    const input = inputRef.current as any as { inputRef: React.MutableRefObject<HTMLInputElement> }
    addField(input.inputRef.current)
  }, [addField])

  return (
    <DayPicker
      value={value}
      onDayChange={onDayChange}
      inputProps={{
        // disabled: this.props.disabled,
        // error: this.props.error,
        onBlur,
        onKeyDown,
        onFocus: onFocus,
      }}
      ref={inputRef}
    />
  )
}
