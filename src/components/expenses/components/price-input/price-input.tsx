import React, { FC, useCallback, useState } from 'react'
import { Input } from 'semantic-ui-react'
import { FormattedNumber } from 'react-intl'

type PriceInputProps = {
  className?: string
  editable?: boolean
  placeholder: string
  value?: number
  onUpdate?: (value: number) => void
}

export const PriceInput: FC<PriceInputProps> = React.memo(
  ({ className, editable = true, placeholder, value, onUpdate }) => {
    const [priceError, setPriceError] = useState(false)
    const updatePrice = useCallback((event) => {
      if (event.target.value.length === 0) {
        setPriceError(false)
        return
      }

      const numeric = parseFloat(event.target.value.replace(',', '.'))
      if (isNaN(numeric)) {
        setPriceError(true)
        return
      }

      setPriceError(false)

      if (onUpdate) {
        onUpdate(numeric)
      }
    }, [onUpdate, setPriceError])
    const renderPrice = useCallback((formattedPrice: string) => (
      <Input
        fluid
        className={className}
        disabled={!editable}
        error={priceError}
        placeholder={placeholder}
        labelPosition="right"
        label={{ basic: true, content: 'PLN' }}
        onChange={updatePrice}
        {...{
          [editable ? 'defaultValue' : 'value']: value !== undefined ? formattedPrice : ''
        }}
      />
    ), [className, editable, placeholder, value, priceError, updatePrice])

    return (
      <FormattedNumber value={value || 0} minimumFractionDigits={2} maximumFractionDigits={2}>
        {renderPrice}
      </FormattedNumber>
    )
  },
)
