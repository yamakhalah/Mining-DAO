import React from 'react'
import { Box } from '@mui/material'

interface BoxProps {
  children: React.ReactNode
}

function BaseBackgroundBox (props: BoxProps): JSX.Element {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#051629'
      }}
    >
      {props.children}
    </Box>
  )
}

export default BaseBackgroundBox
