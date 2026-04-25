import {Box, Text, useInput} from 'ink'
import React from 'react'
import {stringifyFilters} from './filters.js'
import {ScrollView} from './scroll-view.js'
import {useCtx} from './ctx.js'
import {editFilters} from './action/edit-filters.js'

const FilterModal: React.FC = () => {
  const ctx = useCtx()
  useInput((_, key) => {
    if (key.return) {
      editFilters(ctx)
    }
  })
  return (
    <Box
      position='absolute'
      height='100%'
      width='100%'
      justifyContent='center'
      alignItems='center'
    >
      <Box
        flexDirection='column'
        borderStyle={'single'}
        paddingX={4}
        paddingY={1}
        width={65}
        backgroundColor={'black'}
      >
        <Text>
          Filters <Text color='gray'>⏎ to open</Text>
        </Text>
        <Box height={1} />
        <Text>Examples:</Text>
        <Text color='gray'># Don&apos;t need to review your own changes</Text>
        <Text color='blueBright'>email: youremail@example.com</Text>
        <Text color='gray'># Or by name</Text>
        <Text color='blueBright'>name: Your Name</Text>
        <Text color='gray'>
          # Maybe you&apos;re not interested in certain paths:
        </Text>
        <Text color='blueBright'>path: path/to/file.txt</Text>
        <Text color='blueBright'>path: path/to/folder/</Text>
        <Box height={1} />
        <Text>Your Filters:</Text>
        <ScrollView>
          <Text color='blueBright'>{stringifyFilters(ctx.filters)}</Text>
        </ScrollView>
      </Box>
    </Box>
  )
}

export {FilterModal}
