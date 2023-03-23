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
      ...sharedProperties
    },

    isolatedTypography: {
      ...sharedProperties
    },

    gridItem: {
      padding: '5rem 2rem 5rem 2rem'
    }
  }
})
