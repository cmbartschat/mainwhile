import open from 'open'
import {Ctx} from '../ctx.js'

const resolveCommitUrl = async (ctx: Ctx, commit: string): Promise<string> => {
  if (!ctx.remote) {
    throw new Error('Cannot open commit for repo with no remote')
  }

  try {
    const results = await ctx.octo.rest.search.issuesAndPullRequests({
      q:
        commit +
        ' !in:comments' +
        ' is:pull-request repo:' +
        ctx.remote.org +
        '/' +
        ctx.remote.repo,
    })

    if (results.data.items.length !== 1) {
      throw new Error('No singular match in PR')
    }

    const matchedUrl = results.data.items[0]?.html_url
    if (!matchedUrl) {
      throw new Error('No matching PR')
    }

    return matchedUrl
  } catch {
    return ctx.remote.urlBase + '/commit/' + commit
  }
}

const openCommit = async (ctx: Ctx, commit: string) => {
  await open(await resolveCommitUrl(ctx, commit))
}

export {openCommit, resolveCommitUrl}
