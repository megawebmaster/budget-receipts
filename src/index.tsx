import React from 'react'
import ReactDOM from 'react-dom'
import Rollbar from 'rollbar'

// Intl polyfills for IE11, Edge and Safari
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/dist/locale-data/pl'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/pl'

import 'semantic-ui-css/semantic.css'

import { App } from './app'
import * as serviceWorker from './serviceWorker'
import { initEncryption } from './encryption/encryption'

new Rollbar({
  accessToken: '3b2f756af2df4fcdb03ec540f63e1d8f',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
  },
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
initEncryption()
