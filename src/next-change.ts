import {useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'

const useNextChange = () => {
  const ctx = useCtx()
  return useSuspenseQuery({
    queryKey: ['state', 'next-change'],
    queryFn: async (): Promise<ChangeMetadata | null> => {
      const logs = await ctx.git.log({from: ctx.tag, to: ctx.main})
      const remaining = logs.all.length
      const next = logs.all.at(-1)
      if (!next) {
        return null
      }
      return {...next, remaining}
    },
  }).data
}

export {useNextChange}
