import {Ctx} from '../ctx.js'

const accept = async (ctx: Ctx, commit: string) => {
  await ctx.git.tag([ctx.tag, commit, '-f'])
  ctx.refresh()
}

export {accept}
