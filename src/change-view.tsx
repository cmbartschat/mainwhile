import {useMutation, useQuery, useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'
import {Box, Text, useInput} from 'ink'
import React from 'react'
import {Diff} from './diff.js'
import {accept} from './action/accept.js'

interface IChangeView {
  change: ChangeMetadata
}

const VIEWS = ['initial', 'files', 'diff'] as const

const ChangeView: React.FC<IChangeView> = ({change}) => {
  const ctx = useCtx()
  const [viewIndex, setViewIndex] = React.useState(0)
  const view = VIEWS[viewIndex] || VIEWS[0]

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

  const accepting = useMutation({
    mutationKey: ['accept', change.hash],
    mutationFn: async () => accept(ctx, change.hash),
  })

  useInput(async (_, key) => {
    if (key.leftArrow) {
      setViewIndex(s => Math.max(0, s - 1))
      return
    }
    if (key.rightArrow) {
      setViewIndex(s => Math.min(VIEWS.length - 1, s + 1))
      return
    }
    if (key.return) {
      setViewIndex(0)
      return accepting.mutate()
    }
  })

  /*

╒═════════════════════════════ Syntax Error
│
│   Unexpected character in unicode escape pattern
│
└─────────────┐
       1 │ "\ug"
       
       */

  return (
    <Box flexDirection='column'>
      <Text>╒═════════════════════ {change.hash.slice(0, 16)}</Text>
      <Text>
        │ {change.message} │ {change.author_name} │ {change.author_email}
      </Text>
      <Text>└──────────┐</Text>
      {accepting.isPending ? (
        <Text>Accepting...</Text>
      ) : (
        <Box>
          {VIEWS.map((e, i) => (
            <React.Fragment key={e}>
              {i > 0 ? <Text> | </Text> : null}
              <Text color={view === e ? 'blueBright' : undefined}>{e}</Text>
            </React.Fragment>
          ))}
        </Box>
      )}
      {view === 'initial' && (
        <Box>
          <Text color='green'>+{summary.data?.insertions}</Text>
          <Text> </Text>
          <Text color='red'>-{summary.data?.deletions}</Text>
          <Text> | </Text>
          <Text>{change.hash}</Text>
        </Box>
      )}
      {view === 'files' && (
        <Box flexDirection='column'>
          {summary.data?.files.map(file => {
            return (
              <Box key={file.file}>
                {file.binary ? (
                  <Text>(binary)</Text>
                ) : (
                  <>
                    <Text color='green'>+{file.insertions}</Text>
                    <Text> </Text>
                    <Text color='red'>-{file.deletions}</Text>
                  </>
                )}
                <Text> | </Text>
                <Text>{file.file} </Text>
              </Box>
            )
          })}
        </Box>
      )}
      {view === 'diff' && diff.data && <Diff content={diff.data} />}
    </Box>
  )
}

export {ChangeView}
