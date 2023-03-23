import { makeStyles } from 'tss-react/mui'

export default makeStyles()((theme) => {
  return {
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem'
    },

    iconBox: {
      textDecoration: 'none',
      color: 'white',
      '&:hover': {
        textDecoration: 'none',
        color: 'white'
      },
      '&:visited': {
        textDecoration: 'none',
        color: 'white'
      }
    },

    linkBox: {
      paddingRight: '7rem',
      display: 'flex',
      listStyle: 'none'
    },

    link: {
      fontSize: '2.5rem',
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
