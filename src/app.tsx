import React from 'react'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { configureStore } from './app.store'
import { Page } from './components/page'
import messages from './translations/en.json'

const { store } = configureStore()

export const App = () => (
  <IntlProvider key="en" locale="en" messages={messages}>
    <Provider store={store}>
      <Page />
    </Provider>
  </IntlProvider>
)
