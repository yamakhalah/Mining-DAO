import { makeStyles } from 'tss-react/mui'
import backgroundImg from 'style/images/home/FOND DEGRADE.png'

const sharedProperties = {
  padding: '10rem 0rem 5rem 0rem'
}

export default makeStyles()((theme) => {
  return {
    topContainer: {
      marginTop: '10vh',
      height: '100vh',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover'
    },

    groupContainer: {
      margin: '7rem 3rem 7rem 3rem'
    },

    offersContainer: {
      width: '80vw'
    },

    isolatedTypography: {
      ...sharedProperties
    },

    gridItem: {
      padding: '8rem 1rem 8rem 1rem'
    },

    gridItemFull: {
      padding: '0rem',
      margin: '0rem',
      width: '100vw'
    },

    squaredImg: {
      maxWidth: '55%',
      height: 'auto',
      margin: 'auto'
    },

    logoImg: {
      paddingTop: '5rem',
      maxWidth: '50%',
      height: 'auto',
      margin: 'auto'
    },

    coverImg: {
      maxHeight: 'auto',
      width: '100vw'
    },

    button: {
      width: '20%',
      height: '4rem',
      fontSize: '17px',
      color: 'white',
      borderRadius: '5rem'
    }
  }
})
