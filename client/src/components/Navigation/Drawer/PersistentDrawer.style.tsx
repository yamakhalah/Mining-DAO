import { makeStyles } from 'tss-react/mui'

export default makeStyles()((theme) => {
  const drawerWidth = 260

  return {
    drawer: {
      backgroundColor: '#0a2338',
      width: drawerWidth
    },

    drawerPaper: {
      backgroundColor: '#0a2338',
      width: drawerWidth
    },

    link: {
      fontSize: '1.8rem',
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
    },

    homeLink: {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
        color: 'white'
      },
      '&:visited': {
        textDecoration: 'none',
        color: 'white'
      },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },

    logoImg: {
      maxWidth: '80%',
      height: 'auto',
      margin: '2rem 1rem 2rem 1rem'
    },

    connectBox: {
      position: 'relative'
    },

    connectButton: {
      position: 'absolute',
      width: '50%',
      bottom: '10px'
    }
  }
})
