import {Ctx} from '../ctx.js'
import {isSkipped} from '../filters.js'

const accept = async (ctx: Ctx, commit: string) => {
  const logs = await ctx.git.log({from: commit, to: ctx.main})

  /*
      O <-- main [0]
      |
      O <-- need to review [1]
      |
      O <-- filtered out (where the tag should go) [2]
      |
      O <-- commit we're accepting
      |
      O <-- current location of tag
  */

  const nextStopIndex = logs.all.findLastIndex(e => !isSkipped(e, ctx.filters))
  const target = logs.all[nextStopIndex + 1]?.hash || commit
  await ctx.git.tag([ctx.tag, target, '-f'])
  if (ctx.remote) {
    ctx.git.push([
      'origin',
      '+' + target + ':refs/tags/' + ctx.user + '-hindsight',
    ])
  }
  await ctx.refresh()
}

export {accept}
