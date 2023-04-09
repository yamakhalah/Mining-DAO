import React, { useEffect, useState } from 'react'
import { Grid, Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { BaseBackgroundBox } from 'components/index'
import { Header } from 'components'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { InvestTicketContractService } from 'services/InvestTicketContractService'
import { CommercialOfferContractService } from 'services/CommercialOfferContractService'
import { OfferDetail } from 'types/contractTypes/offerTypes'
import useOffersStyle from './offers.style'
import { Ticket } from 'types/contractTypes/investTicketTypes'

function Offers (): JSX.Element {
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { classes } = useOffersStyle()

  const [whitelistedOfferMap, setWhitelistedOfferMap] = useState<Map<string, OfferDetail>>(new Map())
  const [ticketsStakedMap, setTicketsStakedMap] = useState<Map<string, Ticket[]>>(new Map())
  const [ticketsAvailable, setTicketsAvailable] = useState<Ticket[]>([])
  const [forceUpdate, setForceUpdate] = useState(false)

  useEffect(() => {
    async function init (): Promise<void> {
      const investTicketContractService: InvestTicketContractService = InvestTicketContractService.getInstance(address as string, provider)
      const whitelistedAddressList = await investTicketContractService.getWhitelistedOfferContract()
      const tickets: Ticket[] = await investTicketContractService.getTicketsByAddress(address as string)
      console.log('ALL TICKETS', tickets)
      const offersMap = new Map<string, OfferDetail>()
      const ticketsMap = new Map<string, Ticket[]>()
      setTicketsAvailable(tickets.filter(t => !t.isStaked && !t.isUsed))
      for (const offerAddress of whitelistedAddressList) {
        const commercialOfferContractService: CommercialOfferContractService = CommercialOfferContractService.getInstance(offerAddress, address as string, provider)
        const offerDetail: OfferDetail = await commercialOfferContractService.getOfferDetail()
        console.log('OFFER DETAIL', offerDetail)
        const offerTickets = tickets.filter(t => t.isStaked && !t.isUsed && t.escrowContract === offerDetail.address)
        offersMap.set(offerDetail.address, offerDetail)
        ticketsMap.set(offerDetail.address, offerTickets)
      }
      setWhitelistedOfferMap(offersMap)
      setTicketsStakedMap(ticketsMap)
    }

    if (isConnected) {
      init().catch(console.error)
    }
  }, [address, isConnected, forceUpdate])

  const stakeTicketOnOffer = async (offer: OfferDetail): Promise<void> => {
    console.log('STAKE TICKET ON OFFER')
    const commercialOfferContractService: CommercialOfferContractService = CommercialOfferContractService.getInstance(offer.address, address as string, signer)
    const ticket = ticketsAvailable[ticketsAvailable.length - 1]
    await commercialOfferContractService.stakeTicket(ticket.tokenId.toNumber())
    ticketsAvailable.pop()
    setForceUpdate(!forceUpdate)
    alert('Your ticket have been staked')
  }

  return (
    <BaseBackgroundBox>
      <Header title={'Liste des offres'} link={'/info-offres'}/>
      <Grid container
            spacing={1}
            alignItems="center"
            justifyContent="center"
            className={classes.fullContainer}
      >
        { isConnected ? (
          <>
            { [...whitelistedOfferMap.values()].map((offer: OfferDetail) => {
              return (
                <Grid item xs={12} md={6} key={offer.address}>
                  <Grid container
                        alignItems="center"
                        justifyContent="center"
                        className={classes.lightBackground}
                  >
                    <Grid item xs={12} className={classes.containerPadding}>
                      <Typography variant="h4" component="h5" align="center">
                        {offer.offerName}
                      </Typography>
                      <Typography variant="body1" component="p" align="center">
                        Address: {offer.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={[classes.containerPadding, classes.paddingLeft].join(' ')}>
                      <Typography variant="body1" component="p" align="left">
                        Reference:
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        Nombre de ticket minimum:
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        Nombre de ticket maximum:
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        Nombre de ticket en staking:
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        Date limite:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={[classes.containerPadding, classes.paddingLeft].join(' ')}>
                      <Typography variant="body1" component="p" align="left">
                        {offer.ref}
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {offer.minimumTickets}
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {offer.maximumTickets}
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {offer.ticketsCounter}
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {offer.lockTimeLimit.toDateString()}
                      </Typography>
                    </Grid>
                    {offer.workflowStatus === 1 ? (
                      <>
                        <Grid item xs={12} className={classes.container}>
                          <Typography variant="h4" component="h5" align="center" className={classes.lightBackground}>
                            Vos tickets en staking: {ticketsStakedMap?.get(offer.address)?.length ?? 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.containerPadding}>
                          <Box textAlign="center">
                            <Link to="/invest-ticket" className={classes.link}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                className={classes.button}
                              >
                                Acheter un ticket
                              </Button>
                            </Link>
                          </Box>
                        </Grid>
                        <Grid item xs={6} className={classes.containerPadding}>
                          <Box textAlign="center">
                            <Button
                              variant="contained"
                              color="primary"
                              size="medium"
                              className={classes.button}
                              disabled={ticketsAvailable.length === 0}
                              onClick={ () => { stakeTicketOnOffer(offer).catch(console.error) }}
                            >
                              Stake un ticket
                            </Button>
                          </Box>
                        </Grid>
                      </>

                    ) : (
                      <Box className={classes.containerPadding}>
                        <Typography variant="h4" component="h5" align="center">
                          Les inscriptions ne sont pas encore ouvertes
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )
            })}
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

export default Offers
