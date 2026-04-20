import {ResetMode} from 'simple-git'
import {Ctx} from '../ctx.js'

const preview = async (ctx: Ctx, commit: string) => {
  const {git} = ctx
  const status = await git.status()
  if (!status.isClean() && !status.detached) {
    throw new Error('Git state is not clean, cannot preview')
  }
  await git.reset([commit, '--hard'])
  await git.reset(ResetMode.SOFT, [commit + '^1'])
  ctx.refresh()
}

export {preview}
