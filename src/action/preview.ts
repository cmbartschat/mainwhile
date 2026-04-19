import {ResetMode, simpleGit} from 'simple-git'
import {Ctx} from '../ctx.js'

const preview = async (ctx: Ctx, commit: string) => {
  const git = simpleGit(ctx.pwd)
  const status = await git.status()
  if (!status.isClean()) {
    throw new Error('Git state is not clean, cannot preview')
  }
  await git.checkout(commit)
  await git.reset(ResetMode.SOFT, [commit + '^1'])
  ctx.refresh()
}

export {preview}
