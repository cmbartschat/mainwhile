import fs from 'fs/promises'
import {ChangeMetadata} from './change.js'
import {DefaultLogFields} from 'simple-git'
import {Ctx} from './ctx.js'

type Filter = {
  type: 'name' | 'email' | 'path'
  pattern: string
}

const parseFilter = (line: string): Filter => {
  const nonComment = line.split('#')[0]!
  if (nonComment.startsWith('name:')) {
    return {type: 'name', pattern: nonComment.slice('name:'.length).trim()}
  }
  if (nonComment.startsWith('email:')) {
    return {type: 'email', pattern: nonComment.slice('email:'.length).trim()}
  }
  if (nonComment.startsWith('path:')) {
    return {type: 'path', pattern: nonComment.slice('path:'.length).trim()}
  }
  throw new Error('Expected name:, email:, or path: in config file')
}

const parseFilters = (content: string) => {
  const lines = content
    .split('\n')
    .map(e => e.trim())
    .filter(Boolean)
  return lines.filter(e => !e.startsWith('#')).map(parseFilter)
}

const stringifyFilter = (filter: Filter): string => {
  switch (filter.type) {
    case 'email':
      return 'email: ' + filter.pattern
    case 'name':
      return 'name: ' + filter.pattern
    case 'path':
      return 'path: ' + filter.pattern
    default:
      throw new Error('Unexpected filter type')
  }
}

const pathMatches = (pattern: string, path: string) => {
  return pattern === path || (pattern.endsWith('/') && path.startsWith(pattern))
}

const filterMatchesBasic = (
  filter: Filter,
  change: DefaultLogFields | ChangeMetadata,
): boolean | 'needs-file' => {
  switch (filter.type) {
    case 'email':
      return change.author_email === filter.pattern
    case 'name':
      return change.author_name === filter.pattern
    case 'path':
      return 'needs-file'
    default:
      throw new Error('Unexpected filter type')
  }
}

const stringifyFilters = (filters: Filter[]): string => {
  return filters.map(stringifyFilter).join('\n')
}

const loadFilters = async (configPath: string): Promise<Filter[]> => {
  try {
    const content = await fs.readFile(configPath, 'utf8')
    return parseFilters(content)
  } catch (err) {
    if ((err as {code: string}).code === 'ENOENT') {
      return []
    }
    throw err
  }
}

const isSkippedBasic = (
  change: DefaultLogFields | ChangeMetadata,
  filters: Filter[],
): boolean | 'needs-file' => {
  let needsFile = false
  for (const filter of filters) {
    switch (filterMatchesBasic(filter, change)) {
      case true:
        return true
      case false:
        break
      case 'needs-file':
        needsFile = true
        break
      default:
        throw new Error('Unexpected result from filterMatchesBasic')
    }
  }

  return needsFile ? 'needs-file' : false
}

const isSkippedAsync = async (
  ctx: Ctx,
  change: DefaultLogFields | ChangeMetadata,
  filters: Filter[],
) => {
  const basicSkipped = isSkippedBasic(change, filters)
  if (basicSkipped !== 'needs-file') {
    return basicSkipped
  }

  const info = await ctx.queryClient.fetchQuery({
    queryKey: ['diff-summary', change.hash],
    staleTime: Infinity,
    queryFn: async () => {
      return ctx.git.diffSummary([change.hash + '^1', change.hash])
    },
  })
  const changedFiles = info.files.map(e => e.file)
  const ignoredPaths = filters
    .filter(e => e.type === 'path')
    .map(e => e.pattern)
  const allFilesIgnored = changedFiles.every(e =>
    ignoredPaths.some(i => pathMatches(i, e)),
  )

  return allFilesIgnored
}

export {loadFilters, stringifyFilters, isSkippedAsync}

export type {Filter}
