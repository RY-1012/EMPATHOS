'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { EmotionalState, UserPreferences } from '@/types'
import { stateModelingEngine } from '@/lib/engine/state-modeling'
import { orchestrationEngine } from '@/lib/engine/orchestration'
import {
  facialDetector,
  vocalDetector,
  behavioralDetector,
  wearableDetector,
} from '@/lib/detectors'

interface EmotionalStateContextValue {
  currentState: EmotionalState | null
  isProcessing: boolean
  preferences: UserPreferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  startDetection: () => Promise<void>
  stopDetection: () => void
}

const EmotionalStateContext = createContext<EmotionalStateContextValue | null>(null)

const defaultPreferences: UserPreferences = {
  enableFacialDetection: false, // Default off for privacy
  enableVocalDetection: false,
  enableBehavioralTracking: true, // Non-invasive, so default on
  enableWearableIntegration: false,
  deepWorkThreshold: 0.75,
  stressThreshold: 0.7,
  notificationMode: 'adaptive',
  theme: 'auto',
  privacyMode: 'strict',
}

export function EmotionalStateProvider({ children }: { children: React.ReactNode }) {
  const [currentState, setCurrentState] = useState<EmotionalState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [cleanupFunctions, setCleanupFunctions] = useState<(() => void)[]>([])

  const processEmotionalData = useCallback(async () => {
    const inputs: any = {}

    // Collect data from enabled detectors
    if (preferences.enableBehavioralTracking) {
      inputs.behavioral = behavioralDetector.getMetrics()
    }

    if (preferences.enableWearableIntegration) {
      try {
        inputs.wearable = await wearableDetector.getData()
      } catch (error) {
        console.warn('Failed to get wearable data:', error)
      }
    }

    // Compute cognitive state
    const cognitiveModel = stateModelingEngine.computeState(inputs)
    const emotionalState = stateModelingEngine.toEmotionalState(cognitiveModel)

    setCurrentState(emotionalState)

    // Orchestrate environment based on state
    orchestrationEngine.orchestrate(emotionalState)

    // Sync with Tauri backend if available
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      try {
        const { invoke } = await import('@tauri-apps/api/tauri')
        await invoke('update_emotional_state', { newState: emotionalState })
      } catch (error) {
        console.warn('Failed to sync with Tauri backend:', error)
      }
    }
  }, [preferences])

  const startDetection = useCallback(async () => {
    if (isProcessing) return

    setIsProcessing(true)
    const cleanups: (() => void)[] = []

    try {
      // Start continuous processing
      const intervalId = setInterval(processEmotionalData, 2000)
      cleanups.push(() => clearInterval(intervalId))

      // Start facial detection if enabled
      if (preferences.enableFacialDetection) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          const video = document.createElement('video')
          video.srcObject = stream
          await video.play()

          const cleanup = await facialDetector.processVideoStream(
            video,
            (result) => {
              console.log('Facial emotion detected:', result)
            },
            2000
          )
          cleanups.push(() => {
            cleanup()
            stream.getTracks().forEach(track => track.stop())
          })
        } catch (error) {
          console.error('Failed to start facial detection:', error)
        }
      }

      // Start vocal detection if enabled
      if (preferences.enableVocalDetection) {
        try {
          const cleanup = await vocalDetector.startContinuousDetection(
            (result) => {
              console.log('Vocal emotion detected:', result)
            },
            2000
          )
          cleanups.push(cleanup)
        } catch (error) {
          console.error('Failed to start vocal detection:', error)
        }
      }

      setCleanupFunctions(cleanups)
    } catch (error) {
      console.error('Failed to start detection:', error)
      setIsProcessing(false)
    }
  }, [isProcessing, preferences, processEmotionalData])

  const stopDetection = useCallback(() => {
    cleanupFunctions.forEach(fn => fn())
    setCleanupFunctions([])
    setIsProcessing(false)
  }, [cleanupFunctions])

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences(current => ({ ...current, ...prefs }))
  }, [])

  // Auto-start behavioral tracking
  useEffect(() => {
    if (preferences.enableBehavioralTracking) {
      behavioralDetector.startTracking()
    } else {
      behavioralDetector.stopTracking()
    }
  }, [preferences.enableBehavioralTracking])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection()
    }
  }, [stopDetection])

  const value: EmotionalStateContextValue = {
    currentState,
    isProcessing,
    preferences,
    updatePreferences,
    startDetection,
    stopDetection,
  }

  return (
    <EmotionalStateContext.Provider value={value}>
      {children}
    </EmotionalStateContext.Provider>
  )
}

export function useEmotionalState() {
  const context = useContext(EmotionalStateContext)
  if (!context) {
    throw new Error('useEmotionalState must be used within EmotionalStateProvider')
  }
  return context
}
