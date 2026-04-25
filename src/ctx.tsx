import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query'
import React from 'react'
import {Octokit} from 'octokit'
import {simpleGit, SimpleGit} from 'simple-git'
import {extractRemote, Remote} from './remote.js'
import path from 'path'

type Ctx = {
  pwd: string
  tag: 'hindsight'
  main: 'main'
  refresh: () => Promise<void>
  octo: Octokit
  configPath: string
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
      const pwd = (await git.raw(['rev-parse', '--show-toplevel'])).trim()
      return {
        pwd: pwd,
        tag: 'hindsight',
        main: 'main',
        octo: new Octokit({}),
        git,
        configPath: path.join(pwd, '.git', 'hindsight-config'),
        remote: await extractRemote(git),
        refresh: () => queryClient.refetchQueries(),
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
