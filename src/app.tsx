import React from 'react'
import {useNextChange} from './next-change.js'
import {ChangeView} from './change-view.js'
import {FullScreen} from './fullscreen.js'
import {SetupView} from './setup-view.js'
import {CaughtUpView} from './caught-up-view.js'

const App: React.FC = () => {
  const nextChange = useNextChange()

  if (nextChange.type === 'done') {
    return <CaughtUpView />
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
