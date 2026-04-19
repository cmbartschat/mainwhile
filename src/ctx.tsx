import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query'
import React from 'react'
import {Octokit} from 'octokit'
import {simpleGit, SimpleGit} from 'simple-git'
type Ctx = {
  pwd: string
  tag: 'hindsight'
  main: 'main'
  refresh: () => void
  octo: Octokit
  git: SimpleGit
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
      return {
        pwd: process.cwd(),
        tag: 'hindsight',
        main: 'main',
        octo: new Octokit({}),
        git: simpleGit(process.cwd()),
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
