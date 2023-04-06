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
import * as dotenv from 'dotenv'
dotenv.config()

const ALCHEMY_ID: string = process.env.ALCHEMY_ID ?? 'YVEO9LH2Wsju9Wn8pDSKJUs4VMA2kLTo'

const { chains, provider, webSocketProvider } = configureChains(
  [arbitrumGoerli],
  [
    alchemyProvider({ apiKey: ALCHEMY_ID }),
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
