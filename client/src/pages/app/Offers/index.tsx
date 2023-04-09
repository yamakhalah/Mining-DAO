import React, { useEffect, useState } from 'react'
import { Grid, Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { BaseBackgroundBox } from 'components/index'
import { Header } from 'components'
import { useAccount, useProvider } from 'wagmi'
import { InvestTicketContractService } from 'services/InvestTicketContractService'
import { CommercialOfferContractService } from 'services/CommercialOfferContractService'
import { OfferDetail } from 'types/contractTypes/offerTypes'
import useOffersStyle from './offers.style'

function Offers (): JSX.Element {
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  // const { data: signer } = useSigner()
  const { classes } = useOffersStyle()

  const [whitelistedOfferMap, setWhitelistedOfferMap] = useState<Map<string, OfferDetail>>(new Map())

  useEffect(() => {
    async function getContracts (): Promise<void> {
      const investTicketContractService: InvestTicketContractService = InvestTicketContractService.getInstance(address as string, provider)
      const whitelistedAddressList = await investTicketContractService.getWhitelistedOfferContract()
      console.log('WHITELISTED', whitelistedAddressList)
      const offersMap = new Map<string, OfferDetail>()
      for (const offerAddress of whitelistedAddressList) {
        const commercialOfferContractService: CommercialOfferContractService = CommercialOfferContractService.getInstance(offerAddress, address as string, provider)
        const offerDetail: OfferDetail = await commercialOfferContractService.getOfferDetail()
        console.log('OFFER DETAIL', offerDetail)
        offersMap.set(offerDetail.address, offerDetail)
      }
      setWhitelistedOfferMap(offersMap)
    }

    if (isConnected) {
      getContracts().catch(console.error)
    }
  }, [address, isConnected])

  const stakeTicketOnOffer = async (offer: OfferDetail): Promise<void> => {
    console.log('STAKE TICKET ON OFFER', offer)
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
                    <Grid item xs={12}>
                      <Typography variant="h4" component="h5" align="center">
                        {offer.offerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={classes.paddingLeft}>
                      <Typography variant="body1" component="p" align="left">
                        Address:
                      </Typography>
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
                    <Grid item xs={6} className={classes.paddingRight}>
                      <Typography variant="body1" component="p" align="left">
                        {offer.address}
                      </Typography>
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
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          className={classes.button}
                          onClick={ () => { stakeTicketOnOffer(offer).catch(console.error) }}
                        >
                          Stake un ticket
                        </Button>
                      </Box>
                    </Grid>
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
