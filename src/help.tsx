import {Box, Text} from 'ink'
import React from 'react'

const Help: React.FC = () => {
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
      {/* <Text>P - Open change in browser</Text> */}
      {/* <Text>R - Raise issue</Text> */}
      {/* <Text>S - Show settings</Text> */}
      <Text>C - Check out the repo to this change</Text>
      <Text>Q - quit</Text>
    </Box>
  )
}

export {Help}
