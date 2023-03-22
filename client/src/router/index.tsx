import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, AppHome } from '../pages/index'

function DefaultRouter (): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

function AppRouter (): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={<AppHome />} />
    </Routes>
  )
}

export { DefaultRouter, AppRouter }
