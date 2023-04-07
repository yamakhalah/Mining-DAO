import React from 'react'
import { Box } from '@mui/material'
import backgroundImg from 'style/images/BACK-NOIR--PARTICULES-LONG.png'

interface BoxProps {
  children: React.ReactNode
}

function BaseBackgroundBox (props: BoxProps): JSX.Element {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'contain'
      }}
    >
      {props.children}
    </Box>
  )
}

export default BaseBackgroundBox
