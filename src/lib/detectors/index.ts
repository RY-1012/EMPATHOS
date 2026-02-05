// Detector Initialization and Management
import { facialDetector } from './facial'
import { vocalDetector } from './vocal'
import { behavioralDetector } from './behavioral'
import { wearableDetector } from './wearable'

export async function initializeDetectors(): Promise<void> {
  console.log('Initializing all detectors...')
  
  try {
    // Initialize detectors that require async setup
    await Promise.all([
      facialDetector.initialize().catch(err => {
        console.warn('Facial detector initialization failed:', err)
      }),
      vocalDetector.initialize().catch(err => {
        console.warn('Vocal detector initialization failed:', err)
      }),
      wearableDetector.initialize().catch(err => {
        console.warn('Wearable detector initialization failed:', err)
      }),
    ])

    // Behavioral detector doesn't need async init
    behavioralDetector.initialize()
    behavioralDetector.startTracking()

    console.log('All detectors initialized')
  } catch (error) {
    console.error('Failed to initialize detectors:', error)
    throw error
  }
}

export function disposeDetectors(): void {
  console.log('Disposing all detectors...')
  facialDetector.dispose()
  vocalDetector.dispose()
  behavioralDetector.dispose()
  wearableDetector.dispose()
}

export {
  facialDetector,
  vocalDetector,
  behavioralDetector,
  wearableDetector,
}
