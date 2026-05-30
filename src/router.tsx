import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createHashHistory } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

// Create a QueryClient instance for the entire app
export const queryClient = new QueryClient()

// Use hash-based history for GitHub Pages compatibility
// URLs will be in format: https://einfachjan7.github.io/drone-delivery-docs/#/docs
const hashHistory = createHashHistory()

export const router = createTanStackRouter({
  routeTree,
  history: hashHistory,
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


