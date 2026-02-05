// Vocal Emotion Detection
import type { VocalEmotionResult } from '@/types'

export class VocalDetector {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log('Initializing vocal emotion detector...')
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      
      this.isInitialized = true
      console.log('Vocal detector initialized')
    } catch (error) {
      console.error('Failed to initialize vocal detector:', error)
      throw error
    }
  }

  async detectEmotion(audioStream: MediaStream): Promise<VocalEmotionResult> {
    if (!this.isInitialized || !this.audioContext || !this.analyser) {
      throw new Error('Vocal detector not initialized')
    }

    try {
      const source = this.audioContext.createMediaStreamSource(audioStream)
      source.connect(this.analyser)

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(dataArray)

      // Analyze audio features
      const pitch = this.estimatePitch(dataArray)
      const energy = this.calculateEnergy(dataArray)
      const speechRate = this.estimateSpeechRate(dataArray)

      // Map to emotion
      const emotion = this.classifyEmotion(pitch, energy, speechRate)

      return {
        pitch,
        energy,
        speechRate,
        emotion,
        confidence: 0.7,
        metrics: {
          volume: energy,
          frequency: pitch,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Vocal emotion detection failed:', error)
      throw error
    }
  }

  private estimatePitch(frequencies: Uint8Array): number {
    // Simplified pitch estimation
    let sum = 0
    let count = 0
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] > 0) {
        sum += i * frequencies[i]
        count += frequencies[i]
      }
    }
    return count > 0 ? sum / count : 0
  }

  private calculateEnergy(frequencies: Uint8Array): number {
    const sum = frequencies.reduce((acc, val) => acc + val * val, 0)
    return Math.sqrt(sum / frequencies.length) / 255
  }

  private estimateSpeechRate(frequencies: Uint8Array): number {
    // Mock implementation - would use more sophisticated analysis
    return 120 + Math.random() * 60 // words per minute
  }

  private classifyEmotion(
    pitch: number,
    energy: number,
    speechRate: number
  ): 'calm' | 'excited' | 'stressed' | 'neutral' {
    if (energy > 0.7 && speechRate > 160) return 'stressed'
    if (energy > 0.6 && pitch > 100) return 'excited'
    if (energy < 0.3 && speechRate < 100) return 'calm'
    return 'neutral'
  }

  async startContinuousDetection(
    callback: (result: VocalEmotionResult) => void,
    intervalMs: number = 1000
  ): Promise<() => void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    const processAudio = async () => {
      const result = await this.detectEmotion(stream)
      callback(result)
    }

    const intervalId = setInterval(processAudio, intervalMs)
    
    return () => {
      clearInterval(intervalId)
      stream.getTracks().forEach(track => track.stop())
    }
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.analyser = null
    this.isInitialized = false
  }
}

export const vocalDetector = new VocalDetector()
