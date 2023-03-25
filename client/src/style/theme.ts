import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#f67828'
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    allVariants: {
      color: 'white'
    },
    body1: {
      fontSize: '20px'
    }
  }
})

export default theme
