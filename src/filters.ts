import {useSuspenseQuery} from '@tanstack/react-query'
import {useCtx} from './ctx.js'
import fs from 'fs/promises'
import {ChangeMetadata} from './change.js'
import {DefaultLogFields} from 'simple-git'

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
  throw new Error('Expected name:, email:, or path: in hindsight-config file')
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
      return 'email:' + filter.pattern
    case 'name':
      return 'name:' + filter.pattern
    case 'path':
      return 'path:' + filter.pattern
    default:
      throw new Error('Unexpected filter type')
  }
}

const filterMatches = (
  filter: Filter,
  change: DefaultLogFields | ChangeMetadata,
): boolean => {
  switch (filter.type) {
    case 'email':
      return change.author_email === filter.pattern
    case 'name':
      return change.author_name === filter.pattern
    case 'path':
      throw new Error('Path filters are not yet implemented')
    default:
      throw new Error('Unexpected filter type')
  }
}

const stringifyFilters = (filters: Filter[]): string => {
  return filters.map(stringifyFilter).join('\n')
}

const useFilters = () => {
  const ctx = useCtx()
  return useSuspenseQuery({
    queryKey: ['filters'],
    queryFn: async (): Promise<Filter[]> => {
      let content: string
      try {
        content = await fs.readFile(ctx.configPath, 'utf8')
      } catch (err) {
        if ((err as {code: string}).code === 'ENOENT') {
          return []
        }
        throw err
      }
      return parseFilters(content)
    },
  }).data
}

export {useFilters, filterMatches, stringifyFilters}
