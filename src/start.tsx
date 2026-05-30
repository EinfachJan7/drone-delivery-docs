import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import router from './router'

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      {router.dehydrate()}
    </StrictMode>,
  )
}
