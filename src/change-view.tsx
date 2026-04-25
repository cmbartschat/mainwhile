import {useQuery, useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'
import {Box, Text, useApp, useInput} from 'ink'
import React from 'react'
import {Diff} from './diff.js'
import {accept} from './action/accept.js'
import {ScrollView} from './scroll-view.js'
import {preview} from './action/preview.js'
import {Help} from './help.js'
import {openCommit} from './action/open-commit.js'
import {RaiseModal} from './raise-modal.js'
import {raise} from './action/raise.js'
import {FilterModal} from './filter-modal.js'

interface IChangeView {
  change: ChangeMetadata
}

const VIEWS = ['files', 'diff'] as const

const ChangeView: React.FC<IChangeView> = ({change}) => {
  const ctx = useCtx()
  const [mode, setMode] = React.useState<
    'default' | 'help' | 'raise' | 'filters'
  >('default')
  const [viewIndex, setViewIndex] = React.useState(0)
  const view = VIEWS[viewIndex] || VIEWS[0]
  const [status, setStatus] = React.useState('')
  const app = useApp()

  const summary = useSuspenseQuery({
    queryKey: ['diff-summary', change.hash],
    queryFn: async () => {
      return ctx.git.diffSummary([change.hash + '^1', change.hash])
    },
  })

  const diff = useQuery({
    enabled: view === 'diff',
    queryKey: ['diff', change.hash],
    queryFn: async () => {
      return ctx.git.show([change.hash])
    },
  })

  useInput(async (e, key) => {
    if (mode === 'filters' && e === 'f') {
      setMode('default')
      return
    }

    if (mode === 'raise' || mode === 'filters') {
      if (key.escape) {
        setMode('default')
      }
      return
    }
    if (e === 'h') {
      setMode(m => (m === 'help' ? 'default' : 'help'))
      return
    }

    if (e == 'q') {
      app.exit()
      return
    }

    if (mode === 'help') {
      return
    }

    if (e === 'r') {
      setMode('raise')
      return
    }

    if (e === 'f') {
      setMode('filters')
      return
    }

    if (e === 'c') {
      try {
        await preview(ctx, change.hash)
        setStatus('Checked out change.')
      } catch (err) {
        setStatus(String(err))
      }
      return
    }

    if (e === 'p') {
      try {
        setStatus('Opening in browser...')
        await openCommit(ctx, change.hash)
        setStatus('')
      } catch (err) {
        setStatus(String(err))
      }
      return
    }

    if (key.leftArrow) {
      setViewIndex(s => Math.max(0, s - 1))
      return
    }
    if (key.rightArrow) {
      setViewIndex(s => Math.min(VIEWS.length - 1, s + 1))
      return
    }

    if (key.return) {
      setStatus('Accepting..')
      try {
        await accept(ctx, change.hash)
        setViewIndex(0)
        setStatus('')
      } catch (err) {
        setStatus(String(err))
      }
    }
  })

  return (
    <Box flexDirection='column' height='100%' width={'100%'}>
      <Box justifyContent='space-between'>
        <Text color='blueBright'>
          {change.remaining === 1
            ? 'last change to review'
            : change.remaining + ' changes remaining'}
        </Text>
        <Text color='gray'>(h)elp</Text>
      </Box>
      <Text>│</Text>
      <Text>
        │{'   '}
        {change.message}{' '}
      </Text>
      <Text>
        │{'   '}
        <Text color='gray'>
          {change.author_name}{' '}
          <Text color='gray'>{change.hash.slice(0, 16)}</Text>
        </Text>
      </Text>
      <Text>│</Text>
      <Box>
        <Text>└──────────────────────── </Text>
        <Box>
          {VIEWS.map((e, i) => (
            <React.Fragment key={e}>
              {i > 0 ? <Text> ─ </Text> : null}
              <Text backgroundColor={view === e ? 'blue' : undefined}>{e}</Text>
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Box height={1} />
      <Box
        flexGrow={1}
        flexShrink={1}
        flexBasis={0}
        flexDirection='column'
        width={'100%'}
      >
        <ScrollView>
          {view === 'files' && (
            <Box flexDirection='column'>
              {summary.data?.files.map(file => {
                return (
                  <Box key={file.file}>
                    {file.binary ? (
                      <Text>(binary)</Text>
                    ) : (
                      <>
                        <Box minWidth={5}>
                          <Text color='green'>
                            {file.insertions ? '+' + file.insertions : null}
                          </Text>
                        </Box>
                        <Text> </Text>
                        <Box minWidth={5}>
                          <Text color='red'>
                            {file.deletions ? '-' + file.deletions : null}
                          </Text>
                        </Box>
                      </>
                    )}
                    <Text> │ </Text>
                    <Text>{file.file} </Text>
                  </Box>
                )
              })}
            </Box>
          )}
          {view === 'diff' && diff.data && <Diff content={diff.data} />}
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
      {mode === 'help' && (
        <Box
          position='absolute'
          height='100%'
          width='100%'
          justifyContent='center'
          alignItems='center'
        >
          <Help />
        </Box>
      )}
      {mode === 'raise' && (
        <RaiseModal
          onSubmit={async title => {
            try {
              await raise(ctx, change.hash, title)
              setMode('default')
            } catch (err) {
              setStatus(String(err))
            }
          }}
        />
      )}
      {mode === 'filters' && <FilterModal />}
    </Box>
  )
}

export {ChangeView}
