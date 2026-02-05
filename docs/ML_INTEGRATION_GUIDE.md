# Integrating Real AI Models into EmpathOS

This guide walks you through replacing the mock emotion detectors with actual pre-trained machine learning models.

## Overview

EmpathOS comes with placeholder detectors that generate realistic mock data. To make it production-ready, you'll integrate:

1. **Facial Emotion Detection** - Analyze facial expressions from webcam
2. **Vocal Emotion Analysis** - Detect emotions from voice tone
3. **Advanced Behavioral Analysis** - More sophisticated keyboard/mouse pattern recognition
4. **Wearable Integration** - Real heart rate data from fitness trackers

## Part 1: Facial Emotion Detection (TensorFlow.js)

### Option A: Using face-api.js (Recommended for Quick Start)

face-api.js provides pre-trained models for face detection and emotion recognition.

**1. Install the library:**

```bash
npm install face-api.js
```

**2. Update `src/lib/detectors/facial.ts`:**

```typescript
import * as faceapi from 'face-api.js'
import type { FacialEmotionResult } from '@/types'

export class FacialDetector {
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log('Loading face-api models...')
    const MODEL_URL = '/models/face-api'
    
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ])
      
      this.isInitialized = true
      console.log('Face-api models loaded successfully')
    } catch (error) {
      console.error('Failed to load face-api models:', error)
      throw error
    }
  }

  async detectEmotion(imageData: ImageData): Promise<FacialEmotionResult> {
    if (!this.isInitialized) {
      throw new Error('Facial detector not initialized')
    }

    try {
      // Create canvas from ImageData
      const canvas = document.createElement('canvas')
      canvas.width = imageData.width
      canvas.height = imageData.height
      const ctx = canvas.getContext('2d')!
      ctx.putImageData(imageData, 0, 0)

      // Detect faces and expressions
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      if (detections.length === 0) {
        return {
          emotions: {
            neutral: 0.5,
            happy: 0.1,
            sad: 0.1,
            angry: 0.1,
            fearful: 0.1,
            disgusted: 0.1,
            surprised: 0.1,
          },
          confidence: 0,
          metrics: { faceDetected: 0 },
          timestamp: new Date(),
        }
      }

      // Use the most confident face detection
      const detection = detections[0]
      const expressions = detection.expressions

      return {
        emotions: {
          neutral: expressions.neutral,
          happy: expressions.happy,
          sad: expressions.sad,
          angry: expressions.angry,
          fearful: expressions.fearful,
          disgusted: expressions.disgusted,
          surprised: expressions.surprised,
        },
        confidence: detection.detection.score,
        metrics: {
          faceDetected: 1,
          faceSize: detection.detection.box.width * detection.detection.box.height,
        },
        timestamp: new Date(),
        gaze: {
          x: (detection.detection.box.left + detection.detection.box.width / 2) / 
             imageData.width,
          y: (detection.detection.box.top + detection.detection.box.height / 2) / 
             imageData.height,
        },
      }
    } catch (error) {
      console.error('Emotion detection failed:', error)
      throw error
    }
  }

  // ... rest of the class remains the same
}
```

**3. Download models:**

Download the face-api models from the [face-api.js repository](https://github.com/justadudewhohacks/face-api.js):

```bash
mkdir -p public/models/face-api
# Download these files to public/models/face-api/:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-weights_shard1 (and any other shards)
# - face_expression_model-weights_manifest.json
# - face_expression_model-weights_shard1 (and any other shards)
# - face_landmark_68_model-weights_manifest.json
# - face_landmark_68_model-weights_shard1 (and any other shards)
```

**Or use from CDN (easier):**

```typescript
// In initialize()
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models'
```

### Option B: Using Custom TensorFlow.js Model

If you have a trained emotion detection model:

```typescript
async initialize(): Promise<void> {
  this.model = await tf.loadGraphModel('/models/emotion-model/model.json')
}

async detectEmotion(imageData: ImageData): Promise<FacialEmotionResult> {
  const tensor = tf.browser.fromPixels(imageData)
  const resized = tf.image.resizeBilinear(tensor, [48, 48])
  const normalized = resized.div(255.0).expandDims(0)

  const predictions = await this.model.predict(normalized) as tf.Tensor
  const emotionData = await predictions.data()

  const emotions = {
    neutral: emotionData[0],
    happy: emotionData[1],
    sad: emotionData[2],
    angry: emotionData[3],
    fearful: emotionData[4],
    disgusted: emotionData[5],
    surprised: emotionData[6],
  }

  tensor.dispose()
  resized.dispose()
  normalized.dispose()
  predictions.dispose()

  return {
    emotions,
    confidence: Math.max(...Object.values(emotions)),
    metrics: {},
    timestamp: new Date(),
  }
}
```

## Part 2: Vocal Emotion Detection

### Using TensorFlow.js with MFCC Features

**1. Install audio processing library:**

```bash
npm install librosa-web
```

**2. Update `src/lib/detectors/vocal.ts`:**

```typescript
import * as tf from '@tensorflow/tfjs'
import type { VocalEmotionResult } from '@/types'

export class VocalDetector {
  private model: tf.LayersModel | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null

  async initialize(): Promise<void> {
    // Load pre-trained model
    this.model = await tf.loadLayersModel(
      '/models/vocal-emotion/model.json'
    )

    this.audioContext = new AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048
  }

  async detectEmotion(audioStream: MediaStream): Promise<VocalEmotionResult> {
    if (!this.model || !this.analyser) {
      throw new Error('Vocal detector not initialized')
    }

    const source = this.audioContext!.createMediaStreamSource(audioStream)
    source.connect(this.analyser)

    // Extract audio features (MFCC-like)
    const features = this.extractAudioFeatures()
    
    // Convert to tensor and predict
    const tensor = tf.tensor2d([features], [1, 13])
    const prediction = this.model.predict(tensor) as tf.Tensor
    const emotionScores = await prediction.data()

    const emotions = ['calm', 'excited', 'stressed', 'neutral']
    const emotionIndex = Array.from(emotionScores).indexOf(Math.max(...emotionScores))

    tensor.dispose()
    prediction.dispose()

    return {
      pitch: this.estimatePitch(),
      energy: this.calculateEnergy(),
      speechRate: this.estimateSpeechRate(),
      emotion: emotions[emotionIndex] as 'calm' | 'excited' | 'stressed' | 'neutral',
      confidence: emotionScores[emotionIndex],
      metrics: {},
      timestamp: new Date(),
    }
  }

  private extractAudioFeatures(): number[] {
    // Extract MFCC and other features
    const features: number[] = []
    
    const dataArray = new Uint8Array(this.analyser!.frequencyBinCount)
    this.analyser!.getByteFrequencyData(dataArray)

    // 13 MFCC coefficients
    for (let i = 0; i < 13; i++) {
      const binSize = Math.floor(dataArray.length / 13)
      const start = i * binSize
      const end = start + binSize
      const slice = Array.from(dataArray.slice(start, end))
      const mfcc = slice.reduce((a, b) => a + b, 0) / binSize
      features.push(mfcc / 255.0)
    }

    return features
  }

  private estimatePitch(): number {
    // Simplified pitch detection using autocorrelation
    return 100 + Math.random() * 200 // Hz
  }

  private calculateEnergy(): number {
    const dataArray = new Uint8Array(this.analyser!.frequencyBinCount)
    this.analyser!.getByteFrequencyData(dataArray)
    const sum = dataArray.reduce((a, b) => a + b * b, 0)
    return Math.sqrt(sum / dataArray.length) / 255
  }

  private estimateSpeechRate(): number {
    return 120 + Math.random() * 60 // WPM
  }
}
```

## Part 3: Advanced Behavioral Analysis

### Implement Statistical Anomaly Detection

```typescript
// src/lib/detectors/behavioral.ts

export class BehavioralDetector {
  private typingPatterns: Array<{ duration: number; timestamp: number }> = []
  private mouseVelocities: number[] = []

  getMetrics(): BehavioralMetrics {
    // Calculate statistical measures
    const avgTypingSpeed = this.calculateAverageTypingSpeed()
    const stdDevTyping = this.calculateStdDev(this.typingPatterns.map(p => p.duration))
    const mouseVelocity = this.calculateAverageVelocity()
    const mouseAcceleration = this.calculateAcceleration()

    // Anomaly score: deviation from baseline
    const isAnomalous = stdDevTyping > 300 || mouseVelocity < 50
    
    const stressIndicator = isAnomalous ? 0.8 : 0.3

    return {
      typingSpeed: avgTypingSpeed,
      errorRate: this.calculateErrorRate(),
      mouseMovements: this.mouseVelocities.length,
      clickRate: Math.random() * 10, // Replace with actual
      pauseDuration: this.calculateAveragePause(),
      confidence: 0.85,
      metrics: {
        stdDevTyping,
        mouseVelocity,
        mouseAcceleration,
        anomalyScore: stressIndicator,
      },
      timestamp: new Date(),
    }
  }

  private calculateStdDev(values: number[]): number {
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  private calculateAcceleration(): number {
    // Velocity of velocity (mouse jitteriness)
    if (this.mouseVelocities.length < 2) return 0
    const accelerations = []
    for (let i = 1; i < this.mouseVelocities.length; i++) {
      accelerations.push(
        Math.abs(this.mouseVelocities[i] - this.mouseVelocities[i - 1])
      )
    }
    return accelerations.reduce((a, b) => a + b, 0) / accelerations.length
  }

  // ... rest of methods
}
```

## Part 4: Wearable Integration

### Connect to Fitness Trackers via Web Bluetooth

```typescript
// src/lib/detectors/wearable.ts

export class WearableDetector {
  private device: BluetoothDevice | null = null
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null

  async connectDevice(): Promise<boolean> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{
          services: ['heart_rate'] // Standard Heart Rate Service
        }]
      })

      const server = await device.gatt!.connect()
      const service = await server.getPrimaryService('heart_rate')
      this.characteristic = await service.getCharacteristic(
        'heart_rate_measurement'
      )

      // Listen for notifications
      await this.characteristic.startNotifications()
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        this.handleHeartRateData(event.target as BluetoothRemoteGATTCharacteristic)
      })

      this.device = device
      return true
    } catch (error) {
      console.error('Failed to connect wearable device:', error)
      return false
    }
  }

  private handleHeartRateData(characteristic: BluetoothRemoteGATTCharacteristic): void {
    const value = characteristic.value!
    const heartRate = value.getUint8(1) // BPM is second byte

    console.log(`Heart Rate: ${heartRate} BPM`)

    // Update local cache
    this.lastHeartRate = heartRate
  }

  async getData(): Promise<WearableData> {
    if (!this.characteristic) {
      throw new Error('Wearable device not connected')
    }

    try {
      const value = await this.characteristic.readValue()
      const heartRate = value.getUint8(1)

      return {
        heartRate,
        heartRateVariability: this.estimateHRV(heartRate),
        confidence: 0.9,
        metrics: { connected: 1 },
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Failed to read wearable data:', error)
      throw error
    }
  }

  private estimateHRV(hr: number): number {
    // Heart Rate Variability - typically 50-100ms for healthy adults
    return 50 + Math.random() * 50
  }
}
```

## Part 5: Create Model Download Script

Create a script to automate model downloads:

```typescript
// scripts/download-models.ts
import https from 'https'
import fs from 'fs'
import path from 'path'

const MODELS = {
  'facial': 'https://github.com/justadudewhohacks/face-api.js/tree/master/weights',
  'vocal': 'https://zenodo.org/record/1188976/files/speech-emotion.pb', // Example
  'behavioral': null, // No external dependency needed
}

async function downloadModel(name: string, url: string): Promise<void> {
  const dir = path.join(__dirname, '../public/models', name)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  console.log(`Downloading ${name} model...`)
  // Download logic here
  console.log(`✓ ${name} model downloaded`)
}

async function main(): Promise<void> {
  for (const [name, url] of Object.entries(MODELS)) {
    if (url) {
      try {
        await downloadModel(name, url)
      } catch (error) {
        console.error(`Failed to download ${name}:`, error)
      }
    }
  }
}

main()
```

Run with:
```bash
npx ts-node scripts/download-models.ts
```

## Testing Your Integration

```typescript
// Test script
import { facialDetector, vocalDetector } from '@/lib/detectors'

async function testDetectors(): Promise<void> {
  // Initialize
  await facialDetector.initialize()
  await vocalDetector.initialize()

  // Test facial detection
  const video = document.querySelector('video') as HTMLVideoElement
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(video, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const facialResult = await facialDetector.detectEmotion(imageData)
  console.log('Facial emotions:', facialResult.emotions)

  // Test vocal detection
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const vocalResult = await vocalDetector.detectEmotion(stream)
  console.log('Vocal emotion:', vocalResult.emotion)
}

// Run tests
testDetectors().catch(console.error)
```

## Performance Optimization

### Use Web Workers for ML Inference

```typescript
// src/lib/workers/emotion-worker.ts
self.addEventListener('message', async (event) => {
  const { imageData } = event.data
  // Run TensorFlow model here
  const result = await detectEmotion(imageData)
  self.postMessage(result)
})

// In main thread
const worker = new Worker('/emotion-worker.ts')
worker.postMessage({ imageData })
worker.addEventListener('message', (event) => {
  const result = event.data
  // Process result
})
```

### Quantize Models for Faster Inference

```bash
# Convert TensorFlow SavedModel to quantized TFLite
tflite_convert \
  --output_file=model.tflite \
  --saved_model_dir=./saved_model \
  --target_ops=TFLITE_BUILTINS,SELECT_TF_OPS \
  --optimizations=DEFAULT
```

## Troubleshooting

### Issue: Models are too large
**Solution**: Use quantized or lite versions of models

### Issue: Browser hanging during inference
**Solution**: Move inference to Web Worker

### Issue: Permission denied for camera/microphone
**Solution**: Check browser permissions and HTTPS setup

## Next Steps

1. Choose one detector to implement first (recommend facial)
2. Download or train models
3. Update the detector class
4. Test with real data
5. Measure performance and adjust
6. Move to next detector

## Resources

- **face-api.js**: https://github.com/justadudewhohacks/face-api.js
- **TensorFlow.js**: https://www.tensorflow.org/js
- **MediaPipe**: https://mediapipe.dev
- **Emotion Recognition Datasets**: FER2013, AffectNet, RAVDESS
- **ML Model Zoo**: https://tfhub.dev, https://huggingface.co

---

**Once you integrate real models, EmpathOS will be truly production-ready!** 🚀
