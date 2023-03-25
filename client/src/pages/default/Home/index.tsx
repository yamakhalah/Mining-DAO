import React from 'react'
import { BaseBackgroundBox, MiningOfferBox } from 'components'
import {
  Grid,
  Typography,
  Box,
  Button
} from '@mui/material'
import useHomeStyle from './home.style'
import {
  btcDecentralImg,
  industrieImg,
  pognonImg,
  upImg,
  commuImg,
  daoImg,
  decentralImg,
  followImg,
  mutualisationImg,
  schemaImg
} from 'style/images/home'

import {
  offerNFTOrange,
  offerNFTGreyAndWhite,
  offerNFTPurple
} from 'style/images/offers'
import logoImg from 'style/images/LOGO-PNG-BLANC.png'

function Home (): JSX.Element {
  const { classes } = useHomeStyle()

  function moveToApp (): void {
    window.location.replace('http://app.' + window.location.host)
  }

  return (
    <>
      <BaseBackgroundBox>
        <Grid container
              spacing={4}
              alignItems="center"
              justifyContent="center"
        >
          <Grid container
                spacing={2}
                className={classes.topContainer}
          >
            <Grid item xs={12}>
              <Box
                component="img"
                alt="logoImg"
                src={logoImg}
                display="flex"
                className={classes.logoImg}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h1" component="h2" align="center">
                L&apos;unique option pour mutualiser vos ressources
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  className={classes.button}
                  onClick={ () => { moveToApp() }}
                >
                  Découvrir nos offres
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="h3" component="h4" align="center">
              Quand il y a des problèmes...
            </Typography>
          </Grid>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            className={classes.groupContainer}
          >

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                La sécurisation de la blockchain Bitcoin et plus globalement
                des protocole Proof Of Work est de plus en plus centralisé.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="btcDecentralImg"
                src={btcDecentralImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="industrieImg"
                src={industrieImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                Les industriels du minage ayant profité de l&apos;argent magique
                ont monopolisé ce secteur.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                L&apos;écosystème a perdu son esprit communautaire initial, divisé par
                ceux qui ont fait de leur mission prioritaire: la rentabilité
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="upImg"
                src={upImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="pognonImg"
                src={pognonImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                Le coût d&apos;investissement n&apos;a jamais été aussi élevé et les
                besoins opérationnels si complexe (énergie, décibel, chaleur).
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="h3" component="h4" align="center">
              ...il y a des solutions.
            </Typography>
          </Grid>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            className={classes.groupContainer}>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                Mettre en commun les ressources des utilisateurs grâce aux outils
                Web3 permet d&apos;augmenter leur pouvoir de négociation et la rentabilité
                de leur investissement.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="mutualisationImg"
                src={mutualisationImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="daoImg"
                src={daoImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                La gouvernance décentralisée du protocole permet d&apos;inclure
                les utilisateurs dans le processus de création de valeurs.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                Palier le monopole qui s&apos;installe sur le secteur, inhibant la philosophie
                d’un écosystème cryptographique libre.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="decentralImg"
                src={decentralImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="pognonImg"
                src={pognonImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                La tokenisation des offres d&apos;investissements par le protocole
                réduit le coût minimum d&apos;investissement.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                L&apos;esprit communautaire de la gouvernance décentralisée fédère les
                membres de l&apos;organisation en une communauté soudée et engagée.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="commuImg"
                src={commuImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>

            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Box
                component="img"
                alt="followImg"
                src={followImg}
                display="flex"
                className={classes.squaredImg}
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}>
              <Typography variant="body1" component="p" align="center">
                Les technologies de stockage décentralisé et les données API
                des serveurs permettent de suivre le cycle de vie de son
                investissement.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="h3" component="h4" align="center">
              L&apos;écosystème mining DAO
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridItemFull}>
            <Box
              component="img"
              alt="schemaImg"
              src={schemaImg}
              display="flex"
              className={classes.coverImg}
            />
          </Grid>
          <Grid
            container
            className={classes.offersContainer}
          >
          <MiningOfferBox offerImg={offerNFTPurple} tokenImg={''} apy={'30'} />
          <MiningOfferBox offerImg={offerNFTGreyAndWhite} tokenImg={''} apy={'55'} />
          <MiningOfferBox offerImg={offerNFTOrange} tokenImg={''} apy={'95'} />
          </Grid>
        </Grid>
      </BaseBackgroundBox>
    </>
  )
}

export default Home
