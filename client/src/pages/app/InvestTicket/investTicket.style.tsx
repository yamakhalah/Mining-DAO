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

    logoImg: {
      paddingTop: '5rem',
      maxWidth: '100%',
      height: 'auto',
      margin: 'auto'
    },

    button: {
      width: '40%',
      height: '5rem',
      fontSize: '15px',
      color: 'white',
      borderRadius: '5rem'
    }
  }
})
