import React from 'react'
import ReactDOM from 'react-dom'

// Intl polyfills for IE11, Edge and Safari
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/dist/locale-data/pl'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/pl'

import 'semantic-ui-css/semantic.css'

import { App } from './app'
import * as serviceWorker from './serviceWorker'
import { initEncryption } from './encryption/encryption'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
initEncryption();
