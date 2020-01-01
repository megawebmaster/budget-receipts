import React, { FC, useCallback, useEffect, useState } from 'react'
import { Input, Label, Responsive } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import cx from 'classnames'

import styles from './currency-input.module.css'

type CurrencyInputProps = {
  className?: string
  currency: string
  disabled?: boolean
  label?: string
  narrowOnMobile?: boolean
  placeholder?: string
  value: number
  onUpdate?: (value: number) => void
}

export const CurrencyInput: FC<CurrencyInputProps> =
  ({ className, currency, disabled = false, label, narrowOnMobile = false, placeholder = '0.00', value, onUpdate }) => {
    const intl = useIntl()
    const formatCurrency = useCallback(
      (value: number, useGrouping = true) =>
        intl.formatNumber(value, {
          useGrouping,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      [intl],
    )

    const [focused, setFocus] = useState(false)
    const [hasError, setError] = useState(false)

    const [price, setPrice] = useState(formatCurrency(value, false))
    const [formattedPrice, setFormattedPrice] = useState(formatCurrency(value))

    const onFocus = useCallback(() => setFocus(true), [setFocus])
    const onBlur = useCallback((event) => {
      const newValue = event.target.value.replace(',', '.')

      setFocus(false)

      if (!isNaN(newValue)) {
        const numericValue = parseFloat(newValue)
        setPrice(formatCurrency(numericValue, false))

        if (onUpdate) {
          onUpdate(numericValue)
        }
      }
    }, [setFocus, formatCurrency, onUpdate])

    const update = useCallback((event) => {
      const newValue = event.target.value.replace(',', '.')

      setError(false)
      setPrice(newValue)

      if (isNaN(newValue)) {
        setError(true)
        return
      }

      setFormattedPrice(formatCurrency(parseFloat(newValue)))
    }, [setPrice, setFormattedPrice, setError, formatCurrency])

    useEffect(() => {
      setError(false)
      setPrice(formatCurrency(value, false))
      setFormattedPrice(formatCurrency(value))
    }, [value, setPrice, setFormattedPrice, setError, formatCurrency])

    return (
      <Input
        fluid
        className={cx(styles.input, className, { [styles.narrowOnMobile]: narrowOnMobile })}
        disabled={disabled}
        error={hasError}
        labelPosition={'right'}
        onBlur={onBlur}
        onChange={update}
        onFocus={onFocus}
        placeholder={placeholder}
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
