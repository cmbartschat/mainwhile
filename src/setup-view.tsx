import {Ctx, useCtx} from './ctx.js'
import {Box, Text, useApp, useInput} from 'ink'
import React from 'react'
import {accept} from './action/accept.js'
import {ScrollView} from './scroll-view.js'

const getBefore = (timeFrame: string) => async (ctx: Ctx) => {
  const back = await ctx.git.log([
    ctx.main,
    '--first-parent',
    '-n',
    '1',
    '--before',
    timeFrame,
  ])
  if (back.latest) {
    return back.latest.hash
  }
  throw new Error('Unable to find commit')
}

const OPTIONS = [
  {name: 'Now', ref: async (ctx: Ctx) => ctx.main},
  {
    name: 'A day ago',
    ref: getBefore('1 day ago'),
  },
  {
    name: 'A week ago',
    ref: getBefore('1 week ago'),
  },
  {
    name: 'All the way back',
    ref: async (ctx: Ctx) => {
      const back = await ctx.git.log([ctx.main, '--first-parent', '--reverse'])
      if (back.latest) {
        return back.latest.hash
      }
      throw new Error('Unable to find first commit')
    },
  },
] as const

const SetupView: React.FC = () => {
  const ctx = useCtx()
  const [status, setStatus] = React.useState('')
  const app = useApp()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selected = OPTIONS[selectedIndex] || OPTIONS[0]!

  useInput(async (e, key) => {
    if (e == 'q') {
      app.exit()
      return
    }

    if (key.upArrow) {
      setSelectedIndex(s => Math.max(0, s - 1))
      return
    }

    if (key.downArrow) {
      setSelectedIndex(s => Math.min(OPTIONS.length - 1, s + 1))
      return
    }

    if (key.return) {
      setStatus('Setting up...')
      try {
        const ref = await selected.ref(ctx)
        accept(ctx, ref)
        setStatus('')
      } catch (err) {
        setStatus(String(err))
      }
    }
  })

  return (
    <Box flexDirection='column' height='100%' width={'100%'}>
      <Text color='blueBright'>No checkpoint found</Text>
      <Text>│</Text>
      <Text>│{'   '}Choose starting point</Text>
      <Text>
        │{'   '}
        <Text color='gray'>How far back do you want to look?</Text>
      </Text>
      <Text>│</Text>
      <Text>└──────────────────────── </Text>
      <Box height={1} />
      <Box
        flexGrow={1}
        flexShrink={1}
        flexBasis={0}
        flexDirection='column'
        width={'100%'}
      >
        <ScrollView>
          {OPTIONS.map(e => (
            <Text
              color={e === selected ? 'blueBright' : undefined}
              key={e.name}
            >
              {e === selected ? '  > ' : '    '}
              {e.name}
            </Text>
          ))}
        </ScrollView>
      </Box>
      {status && (
        <Box
          borderStyle={'single'}
          paddingBottom={1}
          paddingX={1}
          borderBottom={false}
        >
          <Text>{status}</Text>
        </Box>
      )}
    </Box>
  )
}

export {SetupView}
