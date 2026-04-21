import {TextInput} from '@inkjs/ui'
import {Box, Text} from 'ink'
import React from 'react'

interface IRaiseModal {
  onSubmit: (title: string) => void
}

const RaiseModal: React.FC<IRaiseModal> = ({onSubmit}) => {
  return (
    <Box
      position='absolute'
      height='100%'
      width='100%'
      justifyContent='center'
      alignItems='center'
    >
      <Box
        flexDirection='column'
        borderStyle={'single'}
        paddingX={4}
        paddingY={1}
        width={40}
        backgroundColor={'black'}
      >
        <Text>Title for issue:</Text>
        <TextInput onSubmit={onSubmit} />
        <Text color='gray'>Open in Github ⏎ </Text>
      </Box>
    </Box>
  )
}

export {RaiseModal}
