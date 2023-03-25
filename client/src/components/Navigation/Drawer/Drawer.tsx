import React, { useState } from 'react'
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
  styled
} from '@mui/material'
import {
  Menu,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { NavigationProps, RouterData } from 'types/routerPropsType'
import useDrawerStyle from './Drawer.style'
import theme from 'style/theme'

function NavDrawer ({ homeRoute, routes }: NavigationProps): JSX.Element {
  const { classes } = useDrawerStyle()
  const [openDrawer, setOpenDrawer] = useState(false)

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  }))

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => { setOpenDrawer(false) }}
        classes={{ paper: classes.drawer }}
      >
        <DrawerHeader>
          <IconButton onClick={() => { setOpenDrawer(false) }}>
            {theme.direction === 'ltr' ? <ChevronLeft className={classes.icon} /> : <ChevronRight className={classes.icon} />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Link to={homeRoute.path} className={classes.link}>
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
              <ListItem key={route.title} onClick={() => { setOpenDrawer(false) }}>
                <ListItemText>
                  <Link to={route.path} className={classes.link}>
                    {route.title}
                  </Link>
                </ListItemText>
              </ListItem>
            )
          })}
        </List>
      </Drawer>
      <IconButton onClick={() => { setOpenDrawer(!openDrawer) }}>
        <Menu />
      </IconButton>
    </>
  )
}

export default NavDrawer
