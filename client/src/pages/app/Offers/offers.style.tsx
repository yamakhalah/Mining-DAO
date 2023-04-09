import { makeStyles } from 'tss-react/mui'

export default makeStyles()((theme) => {
  return {
    container: {
      minHeight: '10vh',
      padding: '7rem 7rem 1rem 10rem !important'
    },

    buttonContainer: {
      paddingTop: '0rem'
    },

    fullContainer: {
      height: '90vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },

    containerPadding: {
      padding: '3rem 0rem 3rem 0rem'
    },

    lightBackground: {
      backgroundColor: '#42475F !important',
      borderRadius: '20px',
      margin: 'auto'
    },

    logoImg: {
      paddingTop: '5rem',
      maxWidth: '100%',
      height: 'auto',
      margin: 'auto'
    },

    button: {
      width: '70%',
      height: '5rem',
      fontSize: '15px',
      color: 'white',
      borderRadius: '5rem'
    },

    paddingLeft: {
      paddingLeft: '5rem'
    },

    paddingRight: {
      paddingRight: '3rem'
    },

    link: {
      fontSize: '2rem',
      textDecoration: 'none',
      color: 'white',
      paddingRight: '6rem',
      '&:hover': {
        textDecoration: 'none',
        color: 'white'
      },
      '&:visited': {
        textDecoration: 'none',
        color: 'white'
      }
    }
  }
})
