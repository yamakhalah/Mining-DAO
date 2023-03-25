import React from 'react'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Box,
  Stack,
  Slide,
  IconButton,
  useScrollTrigger
} from '@mui/material'
import {
  YouTube,
  Twitter,
  Instagram,
  Telegram,
  Warning
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { NavigationProps, RouterData } from 'types/routerPropsType'
import useNavbarStyle from './Navbar.style'

function Navbar ({ homeRoute, routes }: NavigationProps): JSX.Element {
  const { classes } = useNavbarStyle()
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar component='nav'>
        <CssBaseline />
        <Toolbar className={classes.toolbar}>
          <Link to={homeRoute.path} className={classes.iconBox}>
            <Box
              component="img"
              alt="logoImg"
              src={homeRoute.img}
              display="flex"
              className={classes.logoImg}
            />
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }} className={classes.linkBox}>
            {routes.map((route: RouterData) => {
              return (
                <Link key={route.title} to={route.path} className={classes.link}>
                  {route.title}
                </Link>
              )
            })}
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton color="secondary">
              <YouTube sx={{ fontSize: '22px' }}/>
            </IconButton>
            <IconButton color="secondary">
              <Warning sx={{ fontSize: '22px' }}/>
            </IconButton>
            <IconButton color="secondary">
              <Twitter sx={{ fontSize: '22px' }}/>
            </IconButton>
            <IconButton color="secondary">
              <Warning sx={{ fontSize: '22px' }}/>
            </IconButton>
            <IconButton color="secondary">
              <Instagram sx={{ fontSize: '22px' }}/>
            </IconButton>
            <IconButton color="secondary">
              <Telegram sx={{ fontSize: '22px' }}/>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}

export default Navbar
