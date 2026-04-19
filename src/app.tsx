import React from 'react'
import {Box, Text} from 'ink'
import {useNextChange} from './next-change.js'
import {ChangeView} from './change-view.js'
import {FullScreen} from './fullscreen.js'

const App: React.FC = () => {
  const nextChange = useNextChange()

  if (!nextChange) {
    return (
      <Box borderStyle={'single'} paddingY={2} justifyContent='center'>
        <Text>All caught up!</Text>
      </Box>
    )
  }
  return (
    <FullScreen>
      <ChangeView change={nextChange} />
    </FullScreen>
  )
}

export {App}
