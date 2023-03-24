import { makeStyles } from 'tss-react/mui'

export default makeStyles()((theme) => {
  return {
    offerImg: {
      maxWidth: '40%',
      height: 'auto',
      margin: 'auto'
    },

    button: {
      width: '40%',
      height: '3rem',
      fontSize: '12px',
      color: 'white',
      borderRadius: '5rem'
    },

    gridItem: {
      margin: '1.5rem 0rem 1.5rem 0rem'
    },

    gridTextItemLeft: {
      paddingLeft: '10rem'
    },

    gridTextItemRight: {
      paddingRight: '10rem'
    }
  }
})
