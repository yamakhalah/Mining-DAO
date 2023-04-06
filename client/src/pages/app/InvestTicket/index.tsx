import React from 'react'
import { Grid } from '@mui/material'
import { BaseBackgroundBox } from 'components/index'
import { Header } from 'components'

function InvestTicket (): JSX.Element {
  return (
    <BaseBackgroundBox>
      <Header title={'Programme de mint et burn'} link={'/info-tickets'}/>
      <Grid container
            spacing={1}
            alignItems="center"
            justifyContent="center"
      >
        <Grid item xs={12}>

        </Grid>
        <Grid item xs={6}>

        </Grid>
        <Grid item xs={6}>

        </Grid>
        <Grid item xs={6}>

        </Grid>
        <Grid item xs={6}>

        </Grid>
      </Grid>
    </BaseBackgroundBox>
  )
}

export default InvestTicket
