import {useSuspenseQuery} from '@tanstack/react-query'
import {ChangeMetadata} from './change.js'
import {useCtx} from './ctx.js'
import {isSkipped} from './filters.js'

type NextChange =
  | {type: 'no-tag'}
  | {type: 'done'}
  | {type: 'review'; change: ChangeMetadata}

const useNextChange = () => {
  const ctx = useCtx()
  return useSuspenseQuery({
    queryKey: ['mutable', 'next-change', ctx.filters],
    queryFn: async (): Promise<NextChange> => {
      let from: string
      try {
        from = await ctx.git.revparse('refs/tags/' + ctx.tag)
      } catch {
        return {type: 'no-tag'}
      }
      const logs = await ctx.git.log({from, to: ctx.main})
      const visibleRemaining = logs.all.filter(e => !isSkipped(e, ctx.filters))
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
