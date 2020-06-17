import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

import { ThemeProvider, theme } from '@chakra-ui/core'
import { CSSReset } from '@chakra-ui/core/dist'

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)

serviceWorker.unregister()
