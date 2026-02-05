# Architecture Documentation

## System Overview

EmpathOS is built as a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│         (Next.js Dashboard, System Tray, Notifications)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Orchestration Layer                         │
│     (Environment Adaptation, UI Theming, Notifications)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│               State Modeling Engine                          │
│    (Multimodal Fusion, Cognitive State Computation)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Detection Layer                             │
│  ┌──────────┬──────────┬──────────────┬─────────────┐       │
│  │ Facial   │  Vocal   │ Behavioral   │ Wearable    │       │
│  │ (TF.js)  │ (WebAPI) │ (DOM Events) │ (Bluetooth) │       │
│  └──────────┴──────────┴──────────────┴─────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Storage Layer                              │
│           (SQLite Local DB, Tauri Backend)                   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Detection Layer

#### Facial Detector (`src/lib/detectors/facial.ts`)
- **Technology**: TensorFlow.js
- **Input**: Video stream from webcam
- **Output**: Emotion probabilities, gaze direction
- **Models**: Face detection + Emotion classification
- **Privacy**: Processes locally, no images stored

#### Vocal Detector (`src/lib/detectors/vocal.ts`)
- **Technology**: Web Audio API
- **Input**: Microphone audio stream
- **Output**: Pitch, energy, speech rate, emotion classification
- **Privacy**: Real-time analysis, no audio recording

#### Behavioral Detector (`src/lib/detectors/behavioral.ts`)
- **Technology**: DOM Event Listeners
- **Input**: Keyboard events, mouse movements
- **Output**: Typing speed, error rate, mouse activity
- **Privacy**: Only aggregate metrics stored

#### Wearable Detector (`src/lib/detectors/wearable.ts`)
- **Technology**: Web Bluetooth API
- **Input**: Heart rate monitors, fitness trackers
- **Output**: HR, HRV, skin temperature, activity
- **Privacy**: Opt-in only, user-controlled

### 2. State Modeling Engine

#### Multimodal Fusion (`src/lib/engine/state-modeling.ts`)

Combines inputs from multiple detectors using confidence-weighted averaging:

```
Focus = w₁·FacialFocus + w₂·BehavioralFocus
Stress = w₁·FacialStress + w₂·VocalStress + w₃·WearableStress
```

Where weights (w) are determined by detector confidence scores.

#### Cognitive States

- **Focus** (0-1): Combination of facial attention, typing consistency, low error rate
- **Stress** (0-1): Facial tension, vocal pitch/energy, heart rate elevation
- **Confusion** (0-1): High error rate, erratic mouse movement, long pauses
- **Flow** (0-1): Optimal typing rhythm, sustained focus, low stress

#### Emotional Dimensions

- **Valence** (-1 to 1): Computed from flow, stress, confusion
- **Arousal** (0-1): Energy level from focus and stress

### 3. Orchestration Engine

#### Trigger Conditions (`src/lib/engine/orchestration.ts`)

| State | Threshold | Action |
|-------|-----------|--------|
| Stress > 0.7 | High stress | Suggest break, breathing exercise |
| Focus > 0.75 & Flow > 0.6 | Deep work | Enable focus mode, silence notifications |
| Confusion > 0.6 | High confusion | Offer help, suggest documentation |
| Focus < 0.3 (after high) | Focus drop | Suggest environment adjustment |

#### Environment Adaptations

```typescript
// Stress → Calming environment
if (stress > 0.6) {
  theme = 'calm'
  adjustments = {
    reduceAnimations: true,
    lowContrast: true,
    warmColors: true,
    minimizeClutter: true
  }
}
```

### 4. Storage Layer

#### SQLite Schema (`src-tauri/src/database.rs`)

```sql
-- Emotional state log
CREATE TABLE emotional_states (
  id INTEGER PRIMARY KEY,
  timestamp TEXT NOT NULL,
  focus REAL,
  stress REAL,
  confusion REAL,
  flow REAL,
  valence REAL,
  arousal REAL,
  context TEXT
);

-- Work sessions
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  start_time TEXT,
  end_time TEXT,
  avg_focus REAL,
  avg_stress REAL,
  avg_flow REAL,
  notes TEXT
);
```

## Data Flow

### Real-Time Processing Pipeline

```
1. User Activity
   ↓
2. Detectors Sample Input (every 2s)
   ↓
3. Generate Detector Results
   ↓
4. State Modeling Engine Computes Cognitive State
   ↓
5. Orchestration Engine Triggers Actions
   ↓
6. UI Updates & Environment Adapts
   ↓
7. State Logged to Database
```

### Cross-Component Communication

**React Context** (`EmotionalStateContext`) manages state across UI components:
- Current emotional state
- User preferences
- Processing status
- Detection controls

**Tauri Commands** bridge frontend ↔ backend:
```rust
#[tauri::command]
fn get_emotional_state() -> EmotionalState
fn update_emotional_state(state: EmotionalState)
fn get_emotional_history(limit: i32) -> Vec<EmotionalState>
```

## Privacy & Security

### Privacy-Preserving Design

1. **Local Processing**: All AI inference runs in browser/desktop app
2. **No Cloud Dependency**: Core features work offline
3. **Ephemeral Data**: Raw sensor data (video, audio) never stored
4. **User Control**: Granular permissions per detector
5. **Encrypted Storage**: SQLite database encrypted at rest

### Security Measures

- **Sandboxed Execution**: Tauri provides OS-level sandboxing
- **CSP Headers**: Content Security Policy prevents XSS
- **No External CDNs**: All assets bundled locally
- **Secure IPC**: Tauri validates all frontend→backend calls

## Performance Optimization

### Efficiency Strategies

1. **Throttling**: Detectors run at 0.5-2 Hz (not per frame)
2. **Web Workers**: Heavy ML inference offloaded to workers
3. **Model Quantization**: Use 8-bit quantized TensorFlow models
4. **Lazy Loading**: Models loaded on-demand when enabled
5. **Circular Buffers**: Limited history (last 1000 states)

### Resource Usage Targets

- CPU: < 5% average (on modern hardware)
- Memory: < 200MB for full stack
- Battery Impact: < 2% per hour (laptop)
- Disk: < 100MB for app + models, ~10MB/day of logs

## Extensibility

### Plugin Architecture (Future)

```typescript
interface EmotionDetectorPlugin {
  name: string
  initialize(): Promise<void>
  detect(): Promise<DetectorResult>
  dispose(): void
}

// Register custom detector
EmpathOS.registerDetector(myCustomDetector)
```

### API for Third-Party Apps

```typescript
// Apps can request emotional context
window.EmpathOS.requestContext()
  .then(context => {
    // Adapt app behavior
  })
```

## Testing Strategy

- **Unit Tests**: Individual detector logic
- **Integration Tests**: State modeling with multiple inputs
- **E2E Tests**: Full pipeline from detection → UI
- **Performance Tests**: Validate < 5% CPU usage
- **Privacy Tests**: Verify no data leakage

## Deployment

### Desktop Distribution

- **Windows**: `.msi` installer
- **macOS**: `.dmg` bundle, signed & notarized
- **Linux**: `.AppImage` / `.deb` / `.rpm`

### Web Version (Limited)

- Dashboard can run in browser (no Tauri features)
- Detectors work via WebAPIs (getUserMedia, Web Audio)
- No system-level orchestration

---

**Next Steps**: See [ROADMAP.md](ROADMAP.md) for upcoming architecture changes.
