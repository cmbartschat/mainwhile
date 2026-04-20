import {SimpleGit} from 'simple-git'

type Remote = {
  apiBase: string
  urlBase: string
  org: string
  repo: string
}

const extractRemote = async (git: SimpleGit): Promise<Remote | null> => {
  const remote = (await git.getRemotes(true)).find(e => e.name === 'origin')
  const remoteUrl = remote?.refs.fetch
  if (!remoteUrl) {
    return null
  }

  const match =
    /^(https:\/github\.com\/|git@github\.com:)(.*)\/(.*)\.git$/.exec(remoteUrl)
  if (!match) {
    return null
  }

  const [, , org, repo] = match

  if (!org || !repo) {
    return null
  }

  return {
    apiBase: 'https://api.github.com/repos/' + org + '/' + repo + '/',
    org,
    repo,
    urlBase: 'https://github.com/' + org + '/' + repo,
  }
}

export {extractRemote}

export type {Remote}
