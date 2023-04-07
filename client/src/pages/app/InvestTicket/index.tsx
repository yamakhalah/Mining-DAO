import React, { useEffect, useState } from 'react'
import { Grid, Box, Typography, Button } from '@mui/material'
import { BaseBackgroundBox } from 'components/index'
import { Header } from 'components'
import { useAccount, useSigner, useProvider } from 'wagmi'
import { InvestTicketContractService } from 'services/InvestTicketContractService'
import { ticketBurn, ticketMint } from 'style/images/investTicket'
import { Ticket } from 'types/contractTypes/investTicketTypes'
import useInvestTicketStyle from './investTicket.style'

function InvestTicket (): JSX.Element {
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const { classes } = useInvestTicketStyle()

  useEffect(() => {
    async function getTickets (): Promise<void> {
      let data: Ticket[] = await InvestTicketContractService.getInstance(address as string, provider).getTicketsByAddress(address as string)
      console.log(data)
      data = data.filter(t => !t.isStaked && !t.isUsed)
      setTickets(data)
    }

    if (isConnected) {
      getTickets()
        .catch(console.error)
    }
  }, [address, isConnected])

  const mintTicket = async (): Promise<void> => {
    const instance: InvestTicketContractService = InvestTicketContractService.getInstance(address as string, signer)
    await instance.mintTicketETH(address as string)
    let newTickets: Ticket[] = await instance.getTicketsByAddress(address as string)
    newTickets = newTickets.filter(t => !t.isStaked && !t.isUsed)
    setTickets(newTickets)
  }

  const burnTicket = async (): Promise<void> => {
    const instance: InvestTicketContractService = InvestTicketContractService.getInstance(address as string, signer)
    await instance.refundTicket(address as string, tickets[0].tokenId.toNumber())
    let newTickets: Ticket[] = await instance.getTicketsByAddress(address as string)
    newTickets = newTickets.filter(t => !t.isStaked && !t.isUsed)
    setTickets(newTickets)
  }

  return (
    <BaseBackgroundBox>
      <Header title={'Programme de mint et burn'} link={'/info-tickets'}/>
      <Grid container
            spacing={1}
            alignItems="center"
            justifyContent="center"
      >
        { isConnected ? (
          <>
            <Grid item xs={12} className={classes.container}>
              <Typography variant="h3" component="h4" align="center">
                Vos tickets: {tickets.length}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box
                component="img"
                alt="logoImg"
                src={ticketMint}
                display="flex"
                className={classes.logoImg}
              />
            </Grid>
            <Grid item xs={6}>
              <Box
                component="img"
                alt="logoImg"
                src={ticketBurn}
                display="flex"
                className={classes.logoImg}
              />
            </Grid>
            <Grid item xs={6} className={classes.buttonContainer}>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={classes.button}
                  onClick={ () => { mintTicket().catch(console.error) }}
                >
                  Acheter un ticket
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} className={classes.buttonContainer}>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={classes.button}
                  disabled={tickets.length === 0}
                  onClick={ () => { burnTicket().catch(console.error) }}
                >
                  Burn un ticket
                </Button>
              </Box>
            </Grid>
          </>
        ) : (
          <Box className={classes.fullContainer}>
            <Typography variant="h2" component="h3" align="center">
              You are not connected
            </Typography>
          </Box>
        )}
      </Grid>
    </BaseBackgroundBox>
  )
}

export default InvestTicket
