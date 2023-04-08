import React, { useEffect, useState } from 'react'
import { Grid, Box, Button } from '@mui/material'
import { BaseBackgroundBox } from 'components/index'
import { Header } from 'components'
import { useAccount, useSigner, useProvider } from 'wagmi'
import useAdminStyle from './admin.style'

function Admin (): JSX.Element {
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { classes } = useInvestTicketStyle()

  useEffect( () => {

  })

  if(isConnected) {

  }
}