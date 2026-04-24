import {Box, Text} from 'ink'
import React from 'react'
import {useCtx} from './ctx.js'

const Help: React.FC = () => {
  const ctx = useCtx()
  return (
    <Box
      flexDirection='column'
      borderStyle={'single'}
      paddingX={4}
      paddingY={1}
      backgroundColor={'black'}
    >
      <Text>Available Actions</Text>
      <Box height={1} />
      <Text>H - Toggle this menu</Text>
      <Text>⏎ - Accept current change</Text>
      {ctx.remote && <Text>P - Open change in browser</Text>}
      {ctx.remote && <Text>R - Raise issue</Text>}
      <Text>F - Show filtering rules</Text>
      <Text>C - Check out this change locally</Text>
      <Text>Q - Quit</Text>
    </Box>
  )
}

export {Help}
