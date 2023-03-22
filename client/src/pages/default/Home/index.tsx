import React from 'react'
import Navbar from '../../../components/Navigation/Navbar'
import { getHomeNavigationProps } from '../../../types/propsType'

function Home (): JSX.Element {
  const navigationProps = getHomeNavigationProps()

  return (
    <Navbar homeRoute={navigationProps.homeRoute} routes={navigationProps.routes} />
  )
}

export default Home
