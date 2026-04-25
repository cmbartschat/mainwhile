import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query'
import React from 'react'
import {Octokit} from 'octokit'
import {simpleGit, SimpleGit} from 'simple-git'
import {extractRemote, Remote} from './remote.js'
import path from 'path'
import {Filter, loadFilters} from './filters.js'

type Ctx = {
  pwd: string
  tag: 'hindsight'
  main: 'main' | 'origin/main'
  refresh: () => Promise<void>
  octo: Octokit
  configPath: string
  git: SimpleGit
  remote: Remote | null
  filters: Filter[]
  user: string
}

const CtxContext = React.createContext<Ctx | null>(null)

const CtxProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const ctx = useLoadCtx()
  return <CtxContext.Provider value={ctx}>{children}</CtxContext.Provider>
}

const useLoadCtx = () => {
  const queryClient = useQueryClient()
  const firstTimeLoad = useSuspenseQuery({
    queryKey: ['first-time'],
    queryFn: async (): Promise<Omit<Ctx, 'filters'>> => {
      const git = simpleGit(process.cwd())
      const pwd = (await git.raw(['rev-parse', '--show-toplevel'])).trim()
      const configPath = path.join(pwd, '.git', 'hindsight-config')
      const remote = await extractRemote(git)
      let main: Ctx['main'] = 'main'
      if (remote) {
        await git.fetch('origin', 'main')
        main = 'origin/main'
      }
      return {
        pwd: pwd,
        tag: 'hindsight',
        main,
        octo: new Octokit({}),
        git,
        configPath,
        remote,
        user: process.env['USER'] || 'unset-user',
        refresh: () => {
          return queryClient.refetchQueries({
            queryKey: ['mutable'],
          })
        },
      }
    },
  })

  const filters = useSuspenseQuery({
    queryKey: ['mutable', 'filters', firstTimeLoad.data.configPath],
    queryFn: () => {
      return loadFilters(firstTimeLoad.data.configPath)
    },
  })

  return React.useMemo(
    () => ({...firstTimeLoad.data, filters: filters.data}),
    [firstTimeLoad.data, filters.data],
  )
}

const useCtx = () => {
  const ctx = React.useContext(CtxContext)
  if (!ctx) {
    throw new Error('Missing CtxProvider')
  }
  return ctx
}

export {Ctx, useCtx, CtxProvider, useLoadCtx}
