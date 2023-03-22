import React from 'react'
import { EthProvider } from './contexts/EthContext'
import { BrowserRouter } from 'react-router-dom'
import { getApp } from './utils/helpers'
import theme from './style/theme'
import { ThemeProvider } from '@mui/material'

const App = (): JSX.Element => {
  const AppWithDomain = getApp()
  return (
    <EthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <div id="App">
                <AppWithDomain />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </EthProvider>
  )
}

export default App
