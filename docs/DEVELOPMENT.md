# Development Guide

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Next.js development server
npm run dev

# In a separate terminal, start Tauri (optional, for desktop app)
npm run tauri:dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Status

✅ **Completed**
- Core architecture and file structure
- Emotion detection modules (facial, vocal, behavioral, wearable)
- State modeling engine with multimodal fusion
- Orchestration system for environment adaptation
- React dashboard with real-time visualizations
- Settings panel with privacy controls
- Tauri backend with SQLite integration
- Complete documentation

⚠️ **Using Mock Data** (Ready for ML Integration)
- Facial detector placeholder (ready for TensorFlow.js model)
- Vocal detector simplified (ready for advanced audio analysis)
- Wearable integration stub (ready for Web Bluetooth)

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Dashboard will be available at `http://localhost:3000`

### 2. Test Emotion Detection

1. Click "Start Detection" button
2. Watch the emotional state meter update in real-time
3. View activity timeline to see state changes over time
4. Check insights panel for personalized recommendations

### 3. Configure Detectors

Go to **Settings** tab to enable/disable:
- Facial Detection (webcam)
- Vocal Detection (microphone)
- Behavioral Tracking (keyboard/mouse)
- Wearable Integration (Bluetooth devices)

## Adding Real AI Models

### Facial Emotion Detection

Replace the mock detector in `src/lib/detectors/facial.ts`:

```typescript
// 1. Download a pre-trained model
// Example: face-api.js or custom TensorFlow.js model

// 2. Update initialize() method
async initialize(): Promise<void> {
  this.model = await tf.loadGraphModel('/models/emotion-model/model.json')
  console.log('Real facial model loaded')
}

// 3. Update detectEmotion() to use real inference
async detectEmotion(imageData: ImageData): Promise<FacialEmotionResult> {
  const tensor = tf.browser.fromPixels(imageData)
  const predictions = await this.model.predict(tensor)
  // Process predictions...
}
```

### Recommended Models

**Facial Recognition:**
- [face-api.js](https://github.com/justadudewhohacks/face-api.js/)
- [MediaPipe Face Detection](https://google.github.io/mediapipe/solutions/face_detection.html)
- Custom TensorFlow.js models from [TensorFlow Hub](https://tfhub.dev/)

**Emotion Classification:**
- FER2013 trained models
- AffectNet models
- Custom models from research papers

## File Structure Reference

```
EmpathOS/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── Dashboard.tsx        # Main dashboard component
│   │   ├── EmotionalStateMeter.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── InsightsPanel.tsx
│   │   └── SettingsPanel.tsx
│   ├── lib/
│   │   ├── detectors/
│   │   │   ├── index.ts         # Detector manager
│   │   │   ├── facial.ts        # TensorFlow.js facial detection
│   │   │   ├── vocal.ts         # Web Audio API vocal analysis
│   │   │   ├── behavioral.ts    # Keyboard/mouse tracking
│   │   │   └── wearable.ts      # Bluetooth wearable integration
│   │   ├── engine/
│   │   │   ├── state-modeling.ts    # Multimodal fusion engine
│   │   │   └── orchestration.ts     # Environment adaptation
│   │   └── context/
│   │       └── EmotionalStateContext.tsx  # React state management
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   └── styles/
│       └── globals.css          # Global styles
├── src-tauri/
│   ├── src/
│   │   ├── main.rs              # Tauri main process
│   │   ├── database.rs          # SQLite operations
│   │   └── emotional_api.rs     # System-level API
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
├── docs/
│   └── ARCHITECTURE.md          # Technical architecture
├── package.json                 # Node dependencies
├── README.md                    # Project overview
└── CONTRIBUTING.md              # Contribution guidelines
```

## Common Tasks

### Adding a New Detector

1. Create detector file in `src/lib/detectors/`
2. Implement the detector interface:

```typescript
export class MyDetector {
  async initialize(): Promise<void> { }
  async detect(): Promise<DetectorResult> { }
  dispose(): void { }
}
```

3. Register in `src/lib/detectors/index.ts`
4. Update state modeling engine to use new data

### Modifying State Computation

Edit `src/lib/engine/state-modeling.ts`:

```typescript
computeState(inputs: DetectorInputs): CognitiveStateModel {
  // Add your custom logic here
}
```

### Adding Orchestration Rules

Edit `src/lib/engine/orchestration.ts`:

```typescript
orchestrate(state: EmotionalState): void {
  if (/* your condition */) {
    const action = this.createCustomAction(state)
    this.notifyCallbacks(action)
  }
}
```

## Building for Production

### Web Build (Dashboard Only)

```bash
npm run build
```

Output in `.next/` directory

### Desktop App (Full EmpathOS)

```bash
npm run tauri:build
```

Installers will be in `src-tauri/target/release/bundle/`

- Windows: `.msi` installer
- macOS: `.app` bundle and `.dmg`
- Linux: `.AppImage`, `.deb`, `.rpm`

## Troubleshooting

### Issue: Detectors not starting

**Solution**: Check browser permissions for webcam/microphone
- Chrome: chrome://settings/content
- Firefox: about:preferences#privacy

### Issue: Tauri build fails

**Solution**: Install Rust toolchain
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install WebView2 (Windows only)
# Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
```

### Issue: TypeScript errors

**Solution**: Regenerate type definitions
```bash
npm run build
# or
npx tsc --noEmit
```

## Performance Optimization Tips

1. **Reduce detection frequency**: Change interval in `EmotionalStateContext.tsx`
   ```typescript
   const intervalId = setInterval(processEmotionalData, 5000) // 5 seconds instead of 2
   ```

2. **Disable unused detectors**: Turn off detectors you're not using in Settings

3. **Use quantized models**: Load 8-bit quantized TensorFlow.js models

4. **Limit history**: Adjust `maxHistorySize` in `state-modeling.ts`

## Next Steps

1. **Integrate Real Models**: Replace mock detectors with actual ML models
2. **Test with Users**: Conduct user studies to validate effectiveness
3. **Optimize Performance**: Profile and optimize for low resource usage
4. **Add Features**: Implement notifications, deep work mode, etc.
5. **Publish**: Distribute via GitHub releases or app stores

## Resources

- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## Getting Help

- 📖 Read [ARCHITECTURE.md](docs/ARCHITECTURE.md) for technical details
- 💬 Join discussions on GitHub
- 🐛 Report issues on GitHub Issues
- 📧 Email: [your-email@example.com]

---

Happy coding! 🧠✨
