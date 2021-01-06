import React from 'react'
import { IntlProvider } from 'react-intl'
import { Meta, Story } from '@storybook/react'

import { CurrencyInput, CurrencyInputProps } from './currency-input'
import messages from '../../translations/pl.json'

export default {
  title: 'Library/CurrencyInput',
  argTypes: {
    currency: { control: 'text' },
    value: { control: 'number' },
  },
} as Meta

export const Basic: Story<CurrencyInputProps> = ({ currency, value: initialValue }) => {
  return (
    <IntlProvider locale="pl" messages={messages}>
      <CurrencyInput currency={currency} value={initialValue} />
    </IntlProvider>
  )
}
Basic.args = {
  currency: 'PLN',
  value: 0.0,
}
