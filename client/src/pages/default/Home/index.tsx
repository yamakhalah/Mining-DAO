import React from 'react'
import { BaseBackgroundBox } from 'components/index'
import {
  Grid,
  Typography
} from '@mui/material'
import useHomeStyle from './home.style'

function Home (): JSX.Element {
  const { classes } = useHomeStyle()
  return (
    <>
      <BaseBackgroundBox>
        <Grid container
              spacing={4}
              alignItems="center"
              justifyContent="center"
        >
          <Grid container
                spacing={4}
                className={classes.topContainer}
          >
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h1" component="h1" align="center">
                MINING DAO
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h2" component="h3" align="center">
                L&apos;unique option pour mutualiser vos ressources
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h2" component="h3" align="center">
                BUTTON HERE
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="h3" component="h4" align="center">
              Quand il y a des problèmes...
            </Typography>
          </Grid>
          <Grid container spacing={4} className={classes.groupContainer}>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            container title
          </Grid>
          <Grid container spacing={4} className={classes.groupContainer}>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Text
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              Img
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            How it works
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            Offers
          </Grid>
        </Grid>
      </BaseBackgroundBox>
    </>
  )
}

export default Home
