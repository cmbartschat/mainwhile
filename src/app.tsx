import React from 'react'
import {Text} from 'ink'
import {useNextChange} from './next-change.js'
import {ChangeView} from './change-view.js'

const App: React.FC = () => {
  const nextChange = useNextChange()

  if (!nextChange) {
    return <Text>All caught up!</Text>
  }
  return <ChangeView change={nextChange} />
}

export {App}
