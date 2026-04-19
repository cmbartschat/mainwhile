import React from 'react'
import {Box, useStdout} from 'ink'

interface IFullScreen {
  children: React.ReactNode
}

const FullScreen: React.FC<IFullScreen> = ({children}) => {
  const stdout = useStdout()
  const [[columns, rows], setSize] = React.useState([
    stdout.stdout.columns,
    stdout.stdout.rows,
  ])
  React.useEffect(() => {
    const handleResize = () => {
      setSize([stdout.stdout.columns, stdout.stdout.rows])
    }
    handleResize()
    stdout.stdout.on('resize', handleResize)
    return () => {
      stdout.stdout.off('handleResize', handleResize)
    }
  }, [stdout.stdout])

  return (
    <Box width={columns} height={rows}>
      {children}
    </Box>
  )
}

export {FullScreen}
