import {useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'

const useNextChange = () => {
  const ctx = useCtx()
  return useSuspenseQuery({
    queryKey: ['state', 'next-change'],
    queryFn: async (): Promise<ChangeMetadata | undefined> => {
      const logs = await ctx.git.log({from: ctx.tag, to: ctx.main})
      return logs.all.at(-2)
    },
  }).data
}

export {useNextChange}
