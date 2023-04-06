import React from 'react'
import usePersistentDrawerStyle from './PersistentDrawer.style'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { NavigationProps, RouterData } from 'types/routerPropsType'
import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function PersistentDrawer ({ homeRoute, routes }: NavigationProps): JSX.Element {
  const { classes } = usePersistentDrawerStyle()

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Link to={homeRoute.path} className={classes.homeLink}>
        <Box
          component="img"
          alt="logoImg"
          src={homeRoute.img}
          className={classes.logoImg}
        />
      </Link>
      <Divider />
      <List>
        {routes.map((route: RouterData) => {
          return (
            <ListItem key={route.title}>
              <ListItemText>
                <Link to={route.path} className={classes.link}>
                  {route.title}
                </Link>
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
          <ConnectButton />
    </Drawer>
  )
}

export default PersistentDrawer
