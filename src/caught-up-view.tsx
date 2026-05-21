import React from 'react'
import {Box, Text} from 'ink'
import {useCtx} from './ctx.js'

const CaughtUpView: React.FC = () => {
  const ctx = useCtx()
  return (
    <Box
      alignItems='flex-start'
      justifyContent='flex-start'
      flexDirection='column'
    >
      <Box
        borderStyle={'single'}
        paddingX={15}
        paddingTop={1}
        alignItems='flex-start'
        justifyContent='flex-end'
        flexDirection='column'
      >
        <Text>All caught up!</Text>

        <Box paddingLeft={2} marginTop={1}>
          <Text color='white'>
            <Text color='green'>{'✓ '}</Text>o
            <Text color='gray'> ←{ctx.remote ? ' origin/main' : ' main'}</Text>
            {'\n  |\n'}
            <Text color='green'>{'✓ '}</Text>o{`\n  |\n`}
            <Text color='green'>{'✓ '}</Text>o{`\n  |`}
          </Text>
        </Box>
      </Box>
      <Box height={1} />
    </Box>
  )
}

export {CaughtUpView}
