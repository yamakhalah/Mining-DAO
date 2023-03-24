import React from 'react'
import {
  Grid,
  Box,
  Typography,
  Button
} from '@mui/material'
import useMiningOfferBoxStyle from './MiningOfferBox.style'

interface MiningOfferBoxProps {
  offerImg: string
  tokenImg: string
  apy: string
}

function MiningOfferBox (props: MiningOfferBoxProps): JSX.Element {
  const { classes } = useMiningOfferBoxStyle()

  return (
    <Grid item xs={12} md={4}>
      <Box
        component="img"
        alt="offerImg"
        src={props.offerImg}
        display="flex"
        className={classes.offerImg}
      />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={6} md={6} className={`${classes.gridItem} ${classes.gridTextItemLeft}`}>
          <Typography variant="body1" component="p" align="center">
            APY
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} className={`${classes.gridItem} ${classes.gridTextItemRight}`}>
          <Typography variant="body1" component="p" align="center">
            Token
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} className={`${classes.gridItem} ${classes.gridTextItemLeft}`}>
          <Typography variant="body1" component="p" align="center">
            {props.apy + '%'}
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} className={`${classes.gridItem} ${classes.gridTextItemRight}`}>
          <Typography variant="body1" component="p" align="center">
            Token IMG HERE
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className={classes.button}
              onClick={ () => {}}
            >
              Acheter des tickets
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className={classes.button}
              onClick={ () => {}}
            >
              Déposer des tickets
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MiningOfferBox
