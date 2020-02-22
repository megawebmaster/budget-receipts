import React from 'react'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { configureStore } from './app.store'
import { Page } from './components/page'
import { PasswordRequirement } from './components/password-requirement'
import messages from './translations/pl.json'

const { store } = configureStore()

export const App = () => (
  <IntlProvider key="pl" locale="pl" messages={messages}>
    <Provider store={store}>
      <PasswordRequirement>
        <Page />
      </PasswordRequirement>
    </Provider>
  </IntlProvider>
)
