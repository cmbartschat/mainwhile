import {Box, Text} from 'ink'
import React from 'react'

interface IDiff {
  content: string
}

const Diff: React.FC<IDiff> = ({content}) => {
  const lines = React.useMemo(() => content.split('\n'), [content])

  return (
    <Box flexDirection='column'>
      {lines.map((e, i) => {
        const color = e.startsWith('+')
          ? 'green'
          : e.startsWith('-')
            ? 'red'
            : undefined
        return (
          <Text key={i} color={color}>
            {e}
          </Text>
        )
      })}
    </Box>
  )
}

export {Diff}
