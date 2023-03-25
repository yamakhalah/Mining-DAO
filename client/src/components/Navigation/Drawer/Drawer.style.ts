import { makeStyles } from 'tss-react/mui'

export default makeStyles()((theme) => {
  return {

    drawer: {
      backgroundColor: '#0a2338'
    },

    icon: {
      color: 'white',
      fontSize: '2.5rem'
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
    },

    logoImg: {
      maxWidth: '30%',
      height: 'auto'
    }
  }
})
