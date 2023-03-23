import React from 'react'
import { getAppNavigationProps } from 'types/propsType'
import NavDrawer from './Drawer/Drawer'

function MainNavigation (): JSX.Element {
  const navigationProps = getAppNavigationProps()
  return (
    <NavDrawer homeRoute={navigationProps.homeRoute} routes={navigationProps.routes} />
  )
}

export default MainNavigation
