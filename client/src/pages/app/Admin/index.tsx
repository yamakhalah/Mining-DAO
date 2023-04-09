import React, { useEffect } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import { BaseBackgroundBox } from 'components/index'
import { Header } from 'components'
import { useAccount, useProvider } from 'wagmi'
import useAdminStyle from './admin.style'
import { InvestTicketContractService } from 'services/InvestTicketContractService'

function Admin (): JSX.Element {
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  // const { data: signer } = useSigner()
  const { classes } = useAdminStyle()

  // const [workflowStatus, setWorkflowStatus] = useState(-1)
  // const [whitelistedOfferContract, setWhitelistedOfferContract] = useState([])

  useEffect(() => {
    async function init (): Promise<void> {
      const investTicketContractService: InvestTicketContractService = InvestTicketContractService.getInstance(address as string, provider)
      console.log('investContractService', investTicketContractService)
      const whitelistedContract = await investTicketContractService.getWhitelistedOfferContract()
      console.log('whitelistedContract', whitelistedContract)
    }

    if (isConnected) {
      init().catch(console.error)
    }
  })

  return (
    <BaseBackgroundBox>
      <Header title={'Page d\'administration'} link={'/info-admin'}/>
      <Grid container
            spacing={1}
            alignItems="center"
            justifyContent="center"
      >
        { isConnected ? (
          <>

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

export default Admin
