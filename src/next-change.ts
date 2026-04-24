import {useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'
import {filterMatches, useFilters} from './filters.js'

const useNextChange = () => {
  const ctx = useCtx()
  const filters = useFilters()
  return useSuspenseQuery({
    queryKey: ['state', 'next-change', filters],
    queryFn: async (): Promise<ChangeMetadata | null> => {
      let target: string = ctx.main
      try {
        await ctx.git.fetch('origin', ctx.main)
        target = 'origin/' + ctx.main
      } catch {
        // Ignore
      }
      const logs = await ctx.git.log({from: ctx.tag, to: target})
      const visibleRemaining = logs.all.filter(e =>
        filters.every(f => !filterMatches(f, e)),
      )
      const next = visibleRemaining.at(-1)
      if (!next) {
        return null
      }
      return {...next, remaining: visibleRemaining.length}
    },
  }).data
}

export {useNextChange}
