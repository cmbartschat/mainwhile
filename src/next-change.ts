import {useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'
import {filterMatches, useFilters} from './filters.js'

type NextChange =
  | {type: 'no-tag'}
  | {type: 'done'}
  | {type: 'review'; change: ChangeMetadata}

const useNextChange = () => {
  const ctx = useCtx()
  const filters = useFilters()
  return useSuspenseQuery({
    queryKey: ['state', 'next-change', filters],
    queryFn: async (): Promise<NextChange> => {
      let target: string = ctx.main
      try {
        await ctx.git.fetch('origin', ctx.main)
        target = 'origin/' + ctx.main
      } catch {
        // Ignore
      }
      let from: string
      try {
        from = await ctx.git.revparse('refs/tags/' + ctx.tag)
      } catch {
        return {type: 'no-tag'}
      }
      const logs = await ctx.git.log({from, to: target})
      const visibleRemaining = logs.all.filter(e =>
        filters.every(f => !filterMatches(f, e)),
      )
      const next = visibleRemaining.at(-1)
      if (!next) {
        return {type: 'done'}
      }
      return {
        type: 'review',
        change: {...next, remaining: visibleRemaining.length},
      }
    },
  }).data
}

export {useNextChange}
