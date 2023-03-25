import React from 'react'
import { getHomeNavigationProps } from 'types/routerPropsType'
import { useTheme, useMediaQuery } from '@mui/material'
import Navbar from './Navbar/Navbar'
import NavDrawer from './Drawer/Drawer'

function MainNavigation (): JSX.Element {
  const navigationProps = getHomeNavigationProps()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    isMobile
      ? (
        <NavDrawer homeRoute={navigationProps.homeRoute} routes={navigationProps.routes} />
        ) : (
        <Navbar homeRoute={navigationProps.homeRoute} routes={navigationProps.routes} />
        )
  )
}

export default MainNavigation
