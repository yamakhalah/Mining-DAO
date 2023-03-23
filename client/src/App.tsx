import React from 'react'
import { EthProvider } from './contexts/EthContext'
import { BrowserRouter } from 'react-router-dom'
import { getApp } from './utils/helpers'
import theme from './style/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'

const App = (): JSX.Element => {
  const AppWithDomain = getApp()
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EthProvider>
        <div id="App">
          <BrowserRouter>
            <AppWithDomain />
          </BrowserRouter>
        </div>
      </EthProvider>
    </ThemeProvider>
  )
}

export default App
