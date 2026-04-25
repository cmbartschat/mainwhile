import React from 'react'
import {Box, Text} from 'ink'
import {useNextChange} from './next-change.js'
import {ChangeView} from './change-view.js'
import {FullScreen} from './fullscreen.js'
import {SetupView} from './setup-view.js'

const App: React.FC = () => {
  const nextChange = useNextChange()

  if (nextChange.type === 'done') {
    return (
      <Box borderStyle={'single'} paddingY={2} justifyContent='center'>
        <Text>All caught up!</Text>
      </Box>
    )
  }

  if (nextChange.type === 'no-tag') {
    return (
      <FullScreen>
        <SetupView />
      </FullScreen>
    )
  }

  return (
    <FullScreen>
      <ChangeView change={nextChange.change} />
    </FullScreen>
  )
}

export {App}
