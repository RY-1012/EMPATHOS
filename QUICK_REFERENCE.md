# 🚀 EmpathOS - Quick Reference

## One-Minute Overview

**EmpathOS** = Your computer that understands your emotions using on-device AI

## Installation

```bash
npm install --legacy-peer-deps
npm run dev
```

Visit: http://localhost:3000

## Key Files

| File | Purpose |
|------|---------|
| `src/components/Dashboard.tsx` | Main UI |
| `src/lib/detectors/` | Emotion detection modules |
| `src/lib/engine/state-modeling.ts` | Cognitive state computation |
| `src/lib/engine/orchestration.ts` | Environment adaptation |
| `src-tauri/src/main.rs` | Desktop app backend |

## Core Concepts

### Emotional State
```typescript
{
  focus: 0-1,      // How concentrated
  stress: 0-1,     // Pressure level
  confusion: 0-1,  // If stuck
  flow: 0-1,       // Deep engagement
  valence: -1 to 1 // Positive/negative
  arousal: 0-1     // Calm/excited
}
```

### Detectors

| Detector | Input | Output |
|----------|-------|--------|
| **Facial** | Webcam | Emotions from face |
| **Vocal** | Microphone | Emotion from voice |
| **Behavioral** | Keyboard/Mouse | Typing patterns |
| **Wearable** | Bluetooth | Heart rate, HRV |

### State Modeling

```
Detectors → Multimodal Fusion → Cognitive State → Orchestration
```

## Common Tasks

### Add a Real ML Model

```typescript
// src/lib/detectors/facial.ts
async initialize() {
  this.model = await tf.loadGraphModel('/models/emotion/model.json')
}

async detectEmotion(image) {
  const tensor = tf.browser.fromPixels(image)
  const predictions = await this.model.predict(tensor)
  return this.processPredictions(predictions)
}
```

### Customize Orchestration

```typescript
// src/lib/engine/orchestration.ts
orchestrate(state: EmotionalState) {
  if (state.stress > 0.8) {
    this.triggerBreakReminder()
  }
}
```

### Adjust Thresholds

```typescript
// In Settings UI or code
orchestrationEngine.updateThreshold('deepWork', 0.8)
```

## API Usage

### From JavaScript (Tauri)

```javascript
// Get current state
const state = await invoke('get_emotional_state')

// Get history
const history = await invoke('get_emotional_history', { limit: 100 })

// Update state
await invoke('update_emotional_state', { newState: {...} })
```

### From React Components

```typescript
import { useEmotionalState } from '@/lib/context/EmotionalStateContext'

function MyComponent() {
  const { currentState, startDetection, stopDetection } = useEmotionalState()
  
  return (
    <div>
      <p>Focus: {currentState?.focus}</p>
      <button onClick={startDetection}>Start</button>
    </div>
  )
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Detector not starting | Check browser permissions |
| Build fails | Run `npm install --legacy-peer-deps` |
| TypeScript errors | Run `npm run build` |
| Tauri errors | Install Rust: rustup.rs |

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run tauri:dev    # Desktop app development
npm run tauri:build  # Build installer
npm run lint         # Check code quality
```

## Privacy Checklist

✅ Enable only needed detectors  
✅ Set privacy mode to "strict"  
✅ Review what data is stored  
✅ All processing is local  
✅ No external data sharing  

## Performance Tips

1. Reduce detection frequency (increase interval)
2. Disable unused detectors
3. Use quantized ML models
4. Limit history size

## Architecture Summary

```
┌─────────────────────┐
│   UI (Next.js)      │
├─────────────────────┤
│   Orchestration     │
├─────────────────────┤
│  State Modeling     │
├─────────────────────┤
│    Detectors        │
│ 👁️ 🎤 ⌨️ ⌚          │
├─────────────────────┤
│  Storage (SQLite)   │
└─────────────────────┘
```

## Key Dependencies

- `next` - React framework
- `@tauri-apps/api` - Desktop integration
- `@tensorflow/tfjs` - ML models
- `recharts` - Data visualization
- `zustand` - State management
- `lucide-react` - Icons

## Metrics Explained

- **Focus**: Neutral facial expression + consistent typing + low errors
- **Stress**: Tense facial expression + high pitch/energy + elevated HR
- **Confusion**: High error rate + erratic movements + long pauses
- **Flow**: Optimal typing rhythm + sustained focus + low stress

## Next Steps

1. **Try it**: Start detection and watch metrics
2. **Customize**: Adjust settings and thresholds
3. **Integrate ML**: Add real emotion detection models
4. **Extend**: Build new features or detectors
5. **Share**: Contribute back to the project

## Resources

- 📖 Full docs: `docs/ARCHITECTURE.md`
- 💻 Dev guide: `docs/DEVELOPMENT.md`
- 🤝 Contributing: `CONTRIBUTING.md`
- 🎉 Setup: `SETUP_COMPLETE.md`

## Getting Help

- GitHub Issues
- GitHub Discussions
- Email: [your-email]

---

**Made with 🧠 by the EmpathOS community**
