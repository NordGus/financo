import { TooltipProvider } from '@components/ui/tooltip'
import QueryClient from "@queries/client"
import { QueryClientProvider } from '@tanstack/react-query'
import 'material-symbols/rounded.css'
import React, { useEffect, useRef } from 'react'
import { RouterProvider } from "react-router"
import useDetectColorScheme from './hooks/use-detect-color-scheme'
import './index.css'
import router from './router'

export default function App() {
    const scheme = useDetectColorScheme()
    const ref = useRef<HTMLElement>(document.documentElement)

    useEffect(() => {
        ref.current.classList.remove(...ref.current.classList)
        ref.current.classList.toggle(scheme)
    }, [scheme])

    return (
        <React.StrictMode>
            <QueryClientProvider client={QueryClient}>
                <TooltipProvider>
                    <RouterProvider router={router} />
                </TooltipProvider>
            </QueryClientProvider>
        </React.StrictMode>
    )
}