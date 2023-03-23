import { createTheme } from '@mui/material'
import { orange } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500]
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
