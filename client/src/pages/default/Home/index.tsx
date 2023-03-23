import React from 'react'
import { BaseBackgroundBox } from 'components/index'
import {
  Grid,
  Typography,
  Box
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
  mutualisationImg
} from 'style/images/home/index'

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
              <Typography variant="body1" component="p" align="center">
                Le coût d&apos;investissement n&apos;a jamais été aussi élevé et les
                besoins opérationnels si complexe (énergie, décibel, chaleur).
              </Typography>
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
