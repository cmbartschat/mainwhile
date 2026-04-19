import React from 'react'
import {Text} from 'ink'

const App: React.FC<{name: string | undefined}> = ({name = 'Stranger'}) => {
  return (
    <Text>
      Hello, <Text color='green'>{name}</Text>
    </Text>
  )
}

export {App}
