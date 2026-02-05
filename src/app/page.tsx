'use client'

import { useEffect, useState } from 'react'
import Dashboard from '@/components/Dashboard'
import { EmotionalStateProvider } from '@/lib/context/EmotionalStateContext'
import { initializeDetectors } from '@/lib/detectors'

export default function Home() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDetectors()
        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize detectors:', error)
        setIsReady(true) // Continue anyway
      }
    }
    init()
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-pulse-slow text-6xl mb-4">🧠</div>
          <h1 className="text-2xl font-bold text-gray-800">Initializing EmpathOS</h1>
          <p className="text-gray-600 mt-2">Loading emotion detection models...</p>
        </div>
      </div>
    )
  }

  return (
    <EmotionalStateProvider>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Dashboard />
      </main>
    </EmotionalStateProvider>
  )
}
