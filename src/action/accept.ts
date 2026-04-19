import {Ctx} from '../ctx.js'

const accept = async (ctx: Ctx, commit: string) => {
  const status = await ctx.git.status()
  if (!status.isClean()) {
    throw new Error('Branch is not clean, cannot advance')
  }
  await ctx.git.tag([ctx.tag, commit, '-f'])
  ctx.refresh()
}

export {accept}
