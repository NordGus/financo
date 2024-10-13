import { TooltipProvider } from '@components/ui/tooltip'
import QueryClient from "@queries/client"
import { QueryClientProvider } from '@tanstack/react-query'
import 'material-symbols/rounded.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={QueryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
