import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getApp } from './utils/helpers'
import theme from './style/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
require('dotenv').config();

const { chains, provider, webSocketProvider } = configureChains(
  [arbitrumGoerli],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Mining DAO App',
  chains
})

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider
})

const App = (): JSX.Element => {
  const AppWithDomain = getApp()
  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <CssBaseline />
            <div id="App">
              <BrowserRouter>
                <AppWithDomain />
              </BrowserRouter>
            </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default App
