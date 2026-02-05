// Behavioral Biometrics Detector (typing, mouse movements)
import type { BehavioralMetrics } from '@/types'

interface KeystrokeEvent {
  timestamp: number
  key: string
  duration: number
}

interface MouseMotionEvent {
  timestamp: number
  x: number
  y: number
  type: 'move' | 'click'
}

export class BehavioralDetector {
  private keystrokes: KeystrokeEvent[] = []
  private mouseEvents: MouseMotionEvent[] = []
  private isTracking = false
  private cleanupFunctions: (() => void)[] = []

  initialize(): void {
    console.log('Initializing behavioral detector...')
    // No async initialization needed
  }

  startTracking(): void {
    if (this.isTracking) return

    this.isTracking = true

    // Track keyboard events
    const keydownTimes = new Map<string, number>()
    
    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent
      keydownTimes.set(keyEvent.key, Date.now())
    }

    const handleKeyUp = (e: Event) => {
      const keyEvent = e as KeyboardEvent
      const downTime = keydownTimes.get(keyEvent.key)
      if (downTime) {
        this.keystrokes.push({
          timestamp: Date.now(),
          key: keyEvent.key,
          duration: Date.now() - downTime,
        })
        keydownTimes.delete(keyEvent.key)
      }

      // Keep only last 100 keystrokes
      if (this.keystrokes.length > 100) {
        this.keystrokes.shift()
      }
    }

    // Track mouse events
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent
      this.mouseEvents.push({
        timestamp: Date.now(),
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        type: 'move',
      })

      // Keep only last 100 mouse events
      if (this.mouseEvents.length > 100) {
        this.mouseEvents.shift()
      }
    }

    const handleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent
      this.mouseEvents.push({
        timestamp: Date.now(),
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        type: 'click',
      })
    }

    document.addEventListener('keydown', handleKeyDown as EventListener)
    document.addEventListener('keyup', handleKeyUp as EventListener)
    document.addEventListener('mousemove', handleMouseMove as EventListener)
    document.addEventListener('click', handleClick as EventListener)

    this.cleanupFunctions.push(
      () => document.removeEventListener('keydown', handleKeyDown as EventListener),
      () => document.removeEventListener('keyup', handleKeyUp as EventListener),
      () => document.removeEventListener('mousemove', handleMouseMove as EventListener),
      () => document.removeEventListener('click', handleClick as EventListener)
    )
  }

  getMetrics(): BehavioralMetrics {
    const now = Date.now()
    const timeWindow = 60000 // 1 minute

    // Filter recent events
    const recentKeystrokes = this.keystrokes.filter(
      k => now - k.timestamp < timeWindow
    )
    const recentMouseEvents = this.mouseEvents.filter(
      m => now - m.timestamp < timeWindow
    )

    // Calculate typing speed
    const wordCount = Math.floor(recentKeystrokes.length / 5) // avg 5 chars per word
    const typingSpeed = wordCount // words per minute

    // Calculate error rate (simplified)
    const backspaceCount = recentKeystrokes.filter(k => k.key === 'Backspace').length
    const errorRate = recentKeystrokes.length > 0
      ? backspaceCount / recentKeystrokes.length
      : 0

    // Calculate mouse movements
    const mouseMovements = recentMouseEvents.filter(m => m.type === 'move').length
    const clickRate = recentMouseEvents.filter(m => m.type === 'click').length

    // Calculate pause duration
    const pauseDurations: number[] = []
    for (let i = 1; i < recentKeystrokes.length; i++) {
      const pause = recentKeystrokes[i].timestamp - recentKeystrokes[i - 1].timestamp
      if (pause < 5000) { // Ignore pauses > 5 seconds
        pauseDurations.push(pause)
      }
    }
    const avgPauseDuration = pauseDurations.length > 0
      ? pauseDurations.reduce((a, b) => a + b, 0) / pauseDurations.length
      : 0

    return {
      typingSpeed,
      errorRate,
      mouseMovements,
      clickRate,
      pauseDuration: avgPauseDuration,
      confidence: 0.8,
      metrics: {
        totalKeystrokes: recentKeystrokes.length,
        totalMouseEvents: recentMouseEvents.length,
      },
      timestamp: new Date(),
    }
  }

  stopTracking(): void {
    this.cleanupFunctions.forEach(fn => fn())
    this.cleanupFunctions = []
    this.isTracking = false
  }

  dispose(): void {
    this.stopTracking()
    this.keystrokes = []
    this.mouseEvents = []
  }
}

export const behavioralDetector = new BehavioralDetector()
