import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthRoute from './authRoute'
import { Home, AppHome, InvestTicket } from 'pages/index'
import { MainNavigation, AppNavigation } from 'components/'
import { useAccount, useProvider } from 'wagmi'
import Admin from 'pages'
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
    const checkIsOwner = async (): Promise<void> => {
      const owner = await InvestTicketContractService.getInstance(address as string, provider).getOwner()
      console.log('ROUTER ADDRESS', owner)
      console.log('WAGMI ADDRESS', address as string)
      if(address as string === owner) {
        setIsOwner(true)
      }
      setIsOwner(false)
    }

    if(isConnected) {
      checkIsOwner().catch(console.error)
    }
  }, [address, isConnected])

  return (
    <>
    <AppNavigation />
    <Routes>
      <Route exact path='/' element={<AppHome />} />
      <Route exact path='/invest-ticket' element={<InvestTicket />} />
      <AuthRoute exact path='/admin' isOwner={isOwner} component={Admin}/>
    </Routes>
    </>
  )
}

export { DefaultRouter, AppRouter }
