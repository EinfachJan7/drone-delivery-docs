import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createBrowserHistory } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

// Create a QueryClient instance for the entire app
export const queryClient = new QueryClient()

// Get the base path from Vite's import.meta.env.BASE_URL or use default
const basePath = import.meta.env.BASE_URL || '/drone-delivery-docs/'

const browserHistory = createBrowserHistory({
  basename: basePath,
})

export const router = createTanStackRouter({
  routeTree,
  history: browserHistory,
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


