import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, AppHome, InvestTicket, Admin, Offer } from 'pages/index'
import { MainNavigation, AppNavigation } from 'components/'
import { useAccount, useProvider } from 'wagmi'
import { InvestTicketContractService } from 'services/InvestTicketContractService'

function DefaultRouter (): JSX.Element {
  return (
    <>
    <MainNavigation />
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
    </>
  )
}

function AppRouter (): JSX.Element {
  const { address, isConnected } = useAccount()
  const provider = useProvider()

  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    console.log('RELOAD router')
    const checkIsOwner = async (): Promise<void> => {
      const owner = await InvestTicketContractService.getInstance(address as string, provider).getOwner()
      console.log('ROUTER ADDRESS', owner)
      console.log('WAGMI ADDRESS', address as string)
      if (address as string === owner) {
        setIsOwner(true)
      }
      setIsOwner(false)
    }

    if (isConnected) {
      checkIsOwner().catch(console.error)
    }
  }, [address, isConnected])

  const PrivateWrapper = ({ children }: { children: JSX.Element }): JSX.Element => {
    return isOwner ? children : <Navigate to="/" replace />
  }

  return (
    <>
    <AppNavigation />
    <Routes>
      <Route path='/' element={<AppHome />} />
      <Route path='/invest-ticket' element={<InvestTicket />} />
      <Route path='/offers' element={<Offer />} />
      <Route path='/admin' element={(
        <PrivateWrapper>
          <Admin />
        </PrivateWrapper>
      )} />
    </Routes>
    </>
  )
}

export { DefaultRouter, AppRouter }
