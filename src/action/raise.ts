import {Ctx} from '../ctx.js'
import {resolveCommitUrl} from './open-commit.js'
import open from 'open'

const raise = async (ctx: Ctx, commit: string, title: string) => {
  if (!ctx.remote) {
    throw new Error('No connected remote.')
  }
  const commitUrl = await resolveCommitUrl(ctx, commit)
  await open(
    ctx.remote.urlBase +
      '/issues/new?' +
      new URLSearchParams({
        title,
        body: commitUrl,
      }),
  )
}

export {raise}
