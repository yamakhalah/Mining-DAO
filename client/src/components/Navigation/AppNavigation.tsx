import React from 'react'
import { getAppNavigationProps } from 'types/routerPropsType'
import PersistentDrawer from './Drawer/PersistentDrawer'

function MainNavigation (): JSX.Element {
  const navigationProps = getAppNavigationProps()
  return (
    <PersistentDrawer homeRoute={navigationProps.homeRoute} routes={navigationProps.routes} />
  )
}

export default MainNavigation
