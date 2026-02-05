// Cognitive State Modeling Engine
import type {
  CognitiveStateModel,
  FacialEmotionResult,
  VocalEmotionResult,
  BehavioralMetrics,
  WearableData,
  EmotionalState,
} from '@/types'

export class StateModelingEngine {
  private history: EmotionalState[] = []
  private readonly maxHistorySize = 1000

  /**
   * Combines multimodal inputs to compute cognitive/emotional state
   */
  computeState(inputs: {
    facial?: FacialEmotionResult
    vocal?: VocalEmotionResult
    behavioral?: BehavioralMetrics
    wearable?: WearableData
  }): CognitiveStateModel {
    const sources: Array<'facial' | 'vocal' | 'behavioral' | 'wearable'> = []

    let focus = 0.5
    let stress = 0.3
    let confusion = 0.2
    let flow = 0.4
    let totalWeight = 0

    // Weight different sources by their confidence
    if (inputs.facial) {
      sources.push('facial')
      const weight = inputs.facial.confidence
      focus += this.computeFocusFromFacial(inputs.facial) * weight
      stress += this.computeStressFromFacial(inputs.facial) * weight
      totalWeight += weight
    }

    if (inputs.vocal) {
      sources.push('vocal')
      const weight = inputs.vocal.confidence
      stress += this.computeStressFromVocal(inputs.vocal) * weight
      totalWeight += weight
    }

    if (inputs.behavioral) {
      sources.push('behavioral')
      const weight = inputs.behavioral.confidence
      focus += this.computeFocusFromBehavioral(inputs.behavioral) * weight
      confusion += this.computeConfusionFromBehavioral(inputs.behavioral) * weight
      flow += this.computeFlowFromBehavioral(inputs.behavioral) * weight
      totalWeight += weight
    }

    if (inputs.wearable) {
      sources.push('wearable')
      const weight = inputs.wearable.confidence
      stress += this.computeStressFromWearable(inputs.wearable) * weight
      totalWeight += weight
    }

    // Normalize by total weight
    if (totalWeight > 0) {
      focus = Math.max(0, Math.min(1, focus / totalWeight))
      stress = Math.max(0, Math.min(1, stress / totalWeight))
      confusion = Math.max(0, Math.min(1, confusion / totalWeight))
      flow = Math.max(0, Math.min(1, flow / totalWeight))
    }

    return {
      focus,
      stress,
      confusion,
      flow,
      confidence: totalWeight / sources.length,
      sources,
    }
  }

  private computeFocusFromFacial(facial: FacialEmotionResult): number {
    // High neutral + low surprised/distracted = high focus
    const focusScore = facial.emotions.neutral * 0.8 - 
                       facial.emotions.surprised * 0.3 -
                       facial.emotions.fearful * 0.2
    
    // Gaze stability also indicates focus
    const gazeStability = facial.gaze ? 
      (1 - Math.abs(facial.gaze.x - 0.5) - Math.abs(facial.gaze.y - 0.5)) : 0.5

    return (focusScore + gazeStability) / 2
  }

  private computeStressFromFacial(facial: FacialEmotionResult): number {
    return facial.emotions.angry * 0.4 + 
           facial.emotions.fearful * 0.3 + 
           facial.emotions.sad * 0.2
  }

  private computeStressFromVocal(vocal: VocalEmotionResult): number {
    if (vocal.emotion === 'stressed') return 0.8
    if (vocal.emotion === 'excited') return 0.5
    if (vocal.emotion === 'calm') return 0.2
    return 0.4
  }

  private computeFocusFromBehavioral(behavioral: BehavioralMetrics): number {
    // Consistent typing + low error rate = high focus
    const typingConsistency = behavioral.typingSpeed > 40 && behavioral.typingSpeed < 120 ? 1 : 0.5
    const lowErrors = 1 - behavioral.errorRate
    const steadyPacing = behavioral.pauseDuration < 2000 ? 0.8 : 0.4

    return (typingConsistency + lowErrors + steadyPacing) / 3
  }

  private computeConfusionFromBehavioral(behavioral: BehavioralMetrics): number {
    // High error rate + erratic movements = confusion
    return behavioral.errorRate * 0.6 + 
           (behavioral.mouseMovements > 100 ? 0.4 : 0.1)
  }

  private computeFlowFromBehavioral(behavioral: BehavioralMetrics): number {
    // Steady typing rhythm + optimal speed = flow state
    const optimalSpeed = behavioral.typingSpeed > 60 && behavioral.typingSpeed < 100
    const lowErrors = behavioral.errorRate < 0.1
    const steadyRhythm = behavioral.pauseDuration > 500 && behavioral.pauseDuration < 1500

    if (optimalSpeed && lowErrors && steadyRhythm) return 0.9
    if (optimalSpeed && lowErrors) return 0.7
    return 0.4
  }

  private computeStressFromWearable(wearable: WearableData): number {
    const hrStress = wearable.heartRate ? 
      Math.max(0, (wearable.heartRate - 60) / 40) : 0.5
    
    const hrvStress = wearable.heartRateVariability ?
      (1 - wearable.heartRateVariability / 100) : 0.5

    return (hrStress + hrvStress) / 2
  }

  /**
   * Convert cognitive model to emotional state
   */
  toEmotionalState(model: CognitiveStateModel, context?: string): EmotionalState {
    // Map cognitive states to valence/arousal
    const valence = (model.flow * 0.5 + (1 - model.stress) * 0.3 + (1 - model.confusion) * 0.2) * 2 - 1
    const arousal = (model.focus * 0.4 + model.stress * 0.6)

    const state: EmotionalState = {
      timestamp: new Date(),
      focus: model.focus,
      stress: model.stress,
      confusion: model.confusion,
      flow: model.flow,
      valence,
      arousal,
      context,
    }

    this.addToHistory(state)
    return state
  }

  private addToHistory(state: EmotionalState): void {
    this.history.push(state)
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  getHistory(limit?: number): EmotionalState[] {
    const states = [...this.history]
    return limit ? states.slice(-limit) : states
  }

  getAverageState(timeWindowMs: number = 300000): EmotionalState | null {
    const now = Date.now()
    const recentStates = this.history.filter(
      s => now - s.timestamp.getTime() < timeWindowMs
    )

    if (recentStates.length === 0) return null

    const avg = recentStates.reduce(
      (acc, state) => ({
        focus: acc.focus + state.focus,
        stress: acc.stress + state.stress,
        confusion: acc.confusion + state.confusion,
        flow: acc.flow + state.flow,
        valence: acc.valence + state.valence,
        arousal: acc.arousal + state.arousal,
      }),
      { focus: 0, stress: 0, confusion: 0, flow: 0, valence: 0, arousal: 0 }
    )

    const count = recentStates.length
    return {
      timestamp: new Date(),
      focus: avg.focus / count,
      stress: avg.stress / count,
      confusion: avg.confusion / count,
      flow: avg.flow / count,
      valence: avg.valence / count,
      arousal: avg.arousal / count,
    }
  }

  clear(): void {
    this.history = []
  }
}

export const stateModelingEngine = new StateModelingEngine()
