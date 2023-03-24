import React from 'react'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Box,
  Slide,
  useScrollTrigger
} from '@mui/material'
import { Link } from 'react-router-dom'
import { NavigationProps, RouterData } from 'types/propsType'
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
            <Typography
              variant='h4'
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              {homeRoute.title}
            </Typography>
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
          <div/>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}

export default Navbar
