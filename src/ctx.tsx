import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query'
import React from 'react'
import {Octokit} from 'octokit'
import {simpleGit, SimpleGit} from 'simple-git'
import {extractRemote, Remote} from './remote.js'

type Ctx = {
  pwd: string
  tag: 'hindsight'
  main: 'main'
  refresh: () => void
  octo: Octokit
  git: SimpleGit
  remote: Remote | null
}

const CtxContext = React.createContext<Ctx | null>(null)

const CtxProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const ctx = useLoadCtx()
  return <CtxContext.Provider value={ctx}>{children}</CtxContext.Provider>
}

const useLoadCtx = () => {
  const queryClient = useQueryClient()
  return useSuspenseQuery({
    queryKey: ['state', 'ctx'],
    queryFn: async (): Promise<Ctx> => {
      const git = simpleGit(process.cwd())
      return {
        pwd: process.cwd(),
        tag: 'hindsight',
        main: 'main',
        octo: new Octokit({}),
        git,
        remote: await extractRemote(git),
        refresh: () =>
          queryClient.resetQueries({
            queryKey: [],
          }),
      }
    },
  }).data
}

const useCtx = () => {
  const ctx = React.useContext(CtxContext)
  if (!ctx) {
    throw new Error('Missing CtxProvider')
  }
  return ctx
}

export {Ctx, useCtx, CtxProvider, useLoadCtx}
