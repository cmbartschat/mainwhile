import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query'
import React from 'react'
import {Octokit} from 'octokit'
import {simpleGit, SimpleGit} from 'simple-git'
import {extractRemote, Remote} from './remote.js'
import path from 'path'
import {Filter, loadFilters} from './filters.js'

const PRODUCT_NAME = 'mainwhile'

type Ctx = {
  pwd: string
  tag: string
  remoteTag: string | undefined
  main: 'main' | 'origin/main'
  refresh: () => Promise<void>
  octo: Octokit
  configPath: string
  git: SimpleGit
  remote: Remote | null
  filters: Filter[]
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
      const configPath = path.join(pwd, '.git', PRODUCT_NAME + '-config')
      const remote = await extractRemote(git)
      const user = process.env['USER']
      let main: Ctx['main'] = 'main'
      let remoteTag: string | undefined
      if (remote && user) {
        await git.fetch('origin', 'main')
        main = 'origin/main'
        remoteTag = user + '-' + PRODUCT_NAME
      }

      if (!user) {
        throw new Error('Unable to resolve username')
      }
      return {
        pwd: pwd,
        tag: PRODUCT_NAME,
        remoteTag,
        main,
        octo: new Octokit({}),
        git,
        configPath,
        remote,
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
