import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Grid, Typography, IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import useHeaderStyle from './Header.style'

interface HeaderProps {
  title: string
  link: string
}

function Header ({ title, link }: HeaderProps): JSX.Element {
  const { classes } = useHeaderStyle()
  return (
    <>
      <Grid container
            spacing={1}
            alignItems="center"
            justifyContent="center"
            className={classes.container}
      >
        <Grid item xs={8}>
          <Typography variant="h2" component="h3" align="center">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ConnectButton />
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary">
            <InfoIcon sx={{ fontSize: '25px' }}/>
          </IconButton>
        </Grid>
      </Grid>
    </>
  )
}

export default Header
