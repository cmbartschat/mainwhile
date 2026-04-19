import React from 'react'
import {render} from 'ink'
import {App} from './app.js'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {CtxProvider} from './ctx.js'

const client = new QueryClient()

render(
  <QueryClientProvider client={client}>
    <CtxProvider>
      <App />
    </CtxProvider>
  </QueryClientProvider>,
)
