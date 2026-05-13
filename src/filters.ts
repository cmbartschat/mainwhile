import fs from 'fs/promises'
import {ChangeMetadata} from './change.js'
import {DefaultLogFields} from 'simple-git'

type Filter = {
  type: 'name' | 'email'
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
      return 'email:' + filter.pattern
    case 'name':
      return 'name:' + filter.pattern
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

const isSkipped = (
  commit: DefaultLogFields | ChangeMetadata,
  filters: Filter[],
): boolean => {
  return filters.some(e => filterMatches(e, commit))
}

export {loadFilters, filterMatches, stringifyFilters, isSkipped}

export type {Filter}
