import { makeStyles } from 'tss-react/mui'

const sharedProperties = {
  margin: '7rem 0rem 7rem 0rem'
}

export default makeStyles()((theme) => {
  return {
    topContainer: {
      ...sharedProperties
    },

    groupContainer: {
      margin: '7rem 3rem 7rem 3rem'
    },

    isolatedTypography: {
      ...sharedProperties
    },

    gridItem: {
      padding: '8rem 1rem 8rem 1rem'
    },

    squaredImg: {
      maxWidth: '55%',
      height: 'auto',
      margin: 'auto'
    }
  }
})
