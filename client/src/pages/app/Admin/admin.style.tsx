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

    lightBackground: {
      backgroundColor: '#42475F !important',
      borderRadius: '20px',
      width: '15vw',
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
