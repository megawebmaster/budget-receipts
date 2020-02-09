import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Input, InputOnChangeData, Label, Responsive } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import cx from 'classnames'

import styles from './currency-input.module.css'

type CurrencyInputProps = {
  className?: string
  currency: string
  disabled?: boolean
  label?: string
  narrowOnMobile?: boolean
  onBlur?: (value: number) => void
  onKeyDown?: (event: React.KeyboardEvent, value: number) => void
  onUpdate?: (value: number) => void
  placeholder?: string
  value: number | string
}

const getValueFromEvent = (event: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
  const newValue = event.currentTarget?.value.replace(',', '.')

  return parseFloat(newValue)
}

export const CurrencyInput: FC<CurrencyInputProps> =
  ({
     className,
     currency,
     disabled = false,
     label,
     narrowOnMobile = false,
     onBlur,
     onKeyDown,
     onUpdate,
     placeholder = '0.00',
     value
  }) => {
    const intl = useIntl()
    const formatCurrency = useCallback(
      (value: number | string, useGrouping = true) =>
        typeof value === 'number'
          ? intl.formatNumber(value, {
            useGrouping,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          : '',
      [intl],
    )

    const ref = useRef<Input>(null)

    const [focused, setFocus] = useState(false)
    const [hasError, setError] = useState(false)

    const [price, setPrice] = useState(formatCurrency(value, false))
    const [formattedPrice, setFormattedPrice] = useState(formatCurrency(value))

    const handleFocus = () => {
      setFocus(true)
      if (price) {
        setPrice(formatCurrency(parseFloat(price.replace(',', '.')), false))
      }
      ref.current?.select()
    }

    const handleBlur = () => {
      const numericValue = parseFloat(price.replace(',', '.'))
      setFocus(false)

      if (!isNaN(numericValue)) {
        setPrice(formatCurrency(numericValue, false))

        if (value !== numericValue && onUpdate) {
          onUpdate(numericValue)
        }
        if (value !== numericValue && onBlur) {
          onBlur(numericValue)
        }
      }
    }

    const update = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      setPrice(data.value)
      setError(false)

      if (data.value.length === 0) {
        setFormattedPrice('')
        return
      }

      const newValue = getValueFromEvent(event)
      if (isNaN(newValue)) {
        setError(true)
        return
      }

      setFormattedPrice(formatCurrency(newValue))
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const newValue = getValueFromEvent(event)

      if (onKeyDown) {
        if (event.key === 'Enter') {
          setPrice('')
          setFormattedPrice('')
        }
        onKeyDown(event, isNaN(newValue) ? value as number : newValue)
      }
    }

    useEffect(() => {
      setError(false)
      setPrice(typeof value === 'number' ? formatCurrency(value, false) : value)
      setFormattedPrice(formatCurrency(value))
    }, [value, formatCurrency])

    return (
      <Input
        fluid
        className={cx(styles.input, className, { [styles.narrowOnMobile]: narrowOnMobile })}
        disabled={disabled}
        error={hasError}
        labelPosition="right"
        onBlur={handleBlur}
        onChange={update}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={ref}
        value={focused ? price : formattedPrice}
      >
        {label && (
          <Responsive {...Responsive.onlyMobile} as={Label} basic className={styles.phoneLabel}>
            {label}:
          </Responsive>
        )}
        <input />
        <Responsive minWidth={narrowOnMobile ? Responsive.onlyTablet.minWidth : 0} as={Label} basic>
          {currency.toUpperCase()}
        </Responsive>
      </Input>
    )
  }
