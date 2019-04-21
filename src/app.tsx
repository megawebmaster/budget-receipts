import React from 'react'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import en from 'react-intl/locale-data/en'

import { configureStore } from './app.store'
import { Page } from './components/page'
import messages from './translations/en.json'

addLocaleData([...en])
const { store } = configureStore()

export const App = () => (
  <IntlProvider key="en" locale="en" messages={messages}>
    <Provider store={store}>
      <Page />
    </Provider>
  </IntlProvider>
)
