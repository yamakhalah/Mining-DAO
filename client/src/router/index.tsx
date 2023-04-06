import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, AppHome, InvestTicket } from 'pages/index'
import { MainNavigation, AppNavigation } from 'components/'

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
  return (
    <>
    <AppNavigation />
    <Routes>
      <Route path='/' element={<AppHome />} />
      <Route path='/invest-ticket' element={<InvestTicket />} />
    </Routes>
    </>
  )
}

export { DefaultRouter, AppRouter }
