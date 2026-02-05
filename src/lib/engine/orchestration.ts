// Environment Orchestration System
import type { EmotionalState, OrchestrationAction } from '@/types'

type ActionCallback = (action: OrchestrationAction) => void

export class OrchestrationEngine {
  private callbacks: Set<ActionCallback> = new Set()
  private lastState: EmotionalState | null = null
  private actionHistory: OrchestrationAction[] = []

  // Thresholds for triggering actions
  private readonly thresholds = {
    highStress: 0.7,
    deepWork: 0.75,
    highConfusion: 0.6,
    lowFocus: 0.3,
  }

  /**
   * Process emotional state and orchestrate environment
   */
  orchestrate(state: EmotionalState): void {
    const actions: OrchestrationAction[] = []

    // Stress management
    if (state.stress > this.thresholds.highStress) {
      actions.push(this.createStressReliefAction(state))
    }

    // Deep work mode
    if (state.focus > this.thresholds.deepWork && state.flow > 0.6) {
      actions.push(this.createDeepWorkAction(state))
    }

    // Confusion assistance
    if (state.confusion > this.thresholds.highConfusion) {
      actions.push(this.createConfusionAssistAction(state))
    }

    // Focus restoration
    if (state.focus < this.thresholds.lowFocus && this.lastState && this.lastState.focus > 0.5) {
      actions.push(this.createFocusRestorationAction(state))
    }

    // UI theme adaptation
    actions.push(this.createThemeAdaptation(state))

    // Execute all actions
    actions.forEach(action => {
      this.actionHistory.push(action)
      this.notifyCallbacks(action)
    })

    this.lastState = state

    // Keep action history manageable
    if (this.actionHistory.length > 100) {
      this.actionHistory.shift()
    }
  }

  private createStressReliefAction(state: EmotionalState): OrchestrationAction {
    return {
      type: 'notification',
      priority: 'high',
      payload: {
        title: 'High Stress Detected',
        message: 'Consider taking a short break. Would you like a breathing exercise?',
        actions: ['Take Break', 'Continue Working', 'Dismiss'],
        duration: 5000,
      },
      triggeredBy: `stress-${state.stress.toFixed(2)}`,
      timestamp: new Date(),
    }
  }

  private createDeepWorkAction(state: EmotionalState): OrchestrationAction {
    return {
      type: 'deep-work',
      priority: 'high',
      payload: {
        mode: 'enable',
        silenceNotifications: true,
        minimizeDistractions: true,
        estimatedDuration: 1800000, // 30 minutes
      },
      triggeredBy: `flow-${state.flow.toFixed(2)}`,
      timestamp: new Date(),
    }
  }

  private createConfusionAssistAction(state: EmotionalState): OrchestrationAction {
    return {
      type: 'assist',
      priority: 'medium',
      payload: {
        title: 'Need Help?',
        message: 'I notice you might be stuck. Would you like me to:',
        suggestions: [
          'Search documentation',
          'Simplify current task',
          'Show examples',
          'Take a break',
        ],
      },
      triggeredBy: `confusion-${state.confusion.toFixed(2)}`,
      timestamp: new Date(),
    }
  }

  private createFocusRestorationAction(state: EmotionalState): OrchestrationAction {
    return {
      type: 'suggestion',
      priority: 'low',
      payload: {
        message: 'Your focus seems to have drifted. Quick tips:',
        tips: [
          'Close unnecessary tabs',
          'Review your current goal',
          'Take a 2-minute walk',
          'Adjust lighting/environment',
        ],
      },
      triggeredBy: `focus-drop-${state.focus.toFixed(2)}`,
      timestamp: new Date(),
    }
  }

  private createThemeAdaptation(state: EmotionalState): OrchestrationAction {
    let theme: 'calm' | 'energetic' | 'neutral' = 'neutral'
    let uiAdjustments: any = {}

    if (state.stress > 0.6) {
      theme = 'calm'
      uiAdjustments = {
        reduceAnimations: true,
        lowContrast: true,
        warmColors: true,
        minimizeClutter: true,
      }
    } else if (state.arousal > 0.7 && state.valence > 0) {
      theme = 'energetic'
      uiAdjustments = {
        vibrantColors: true,
        smoothAnimations: true,
      }
    }

    return {
      type: 'ui-theme',
      priority: 'low',
      payload: {
        theme,
        ...uiAdjustments,
      },
      triggeredBy: `state-adaptation`,
      timestamp: new Date(),
    }
  }

  /**
   * Register callback for orchestration actions
   */
  subscribe(callback: ActionCallback): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  private notifyCallbacks(action: OrchestrationAction): void {
    this.callbacks.forEach(callback => {
      try {
        callback(action)
      } catch (error) {
        console.error('Orchestration callback error:', error)
      }
    })
  }

  getActionHistory(limit?: number): OrchestrationAction[] {
    const history = [...this.actionHistory]
    return limit ? history.slice(-limit) : history
  }

  updateThreshold(key: keyof typeof this.thresholds, value: number): void {
    if (value >= 0 && value <= 1) {
      this.thresholds[key] = value
    }
  }

  getThresholds() {
    return { ...this.thresholds }
  }
}

export const orchestrationEngine = new OrchestrationEngine()
