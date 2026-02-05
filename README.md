# EmpathOS - Emotion-Aware Digital Habitat

<div align="center">

🧠 **Transform your computer into an emotionally intelligent partner**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-1.5-orange)](https://tauri.app/)

</div>

## 🎯 Vision

EmpathOS is an **open-source, local-first operating system layer** that uses on-device AI to continuously and privately analyze your multimodal signals—transforming your digital environment into an emotionally intelligent partner that adapts to your cognitive and emotional state in real-time.

## ✨ Key Features

### 🔍 **Multimodal Emotion Detection**
- **Facial Analysis** (TensorFlow.js) - Webcam-based affective computing
- **Vocal Analysis** - Paralinguistic emotion detection from microphone
- **Behavioral Biometrics** - Typing rhythms, mouse movement patterns
- **Wearable Integration** - Heart rate variability from fitness trackers

### 🧠 **Real-Time Cognitive State Modeling**
- **Focus** - How concentrated you are on your current task
- **Stress** - Level of tension or pressure you're experiencing
- **Confusion** - Indicates if you're stuck or uncertain
- **Flow** - That optimal state of deep, effortless engagement

### 🎨 **Proactive Environment Orchestration**
- **Adaptive UI Themes** - Calming colors when stressed, energetic when engaged
- **Smart Notifications** - Silenced during deep work, surfaced when appropriate
- **Deep Work Mode** - Auto-enables when flow state is detected
- **Contextual Assistance** - Surfaces relevant docs when confusion is detected

### 📊 **Emotional Analytics & Insights**
- Session logs with emotional context
- Pattern recognition for optimal productivity conditions
- Personalized recommendations based on your unique patterns
- Privacy-preserving research data generation

### 🔒 **Privacy-First Architecture**
- All processing happens **on-device** using TensorFlow.js & ONNX Runtime
- No cloud dependencies for core functionality
- Explicit user consent for any data sharing
- Complete control over what gets monitored

## 🏗️ Architecture

```
EmpathOS/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── EmotionalStateMeter.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── InsightsPanel.tsx
│   │   └── SettingsPanel.tsx
│   ├── lib/
│   │   ├── detectors/          # Emotion detection modules
│   │   │   ├── facial.ts       # TensorFlow.js facial detection
│   │   │   ├── vocal.ts        # Audio analysis
│   │   │   ├── behavioral.ts   # Keyboard/mouse tracking
│   │   │   └── wearable.ts     # Fitness tracker integration
│   │   ├── engine/
│   │   │   ├── state-modeling.ts    # Cognitive state computation
│   │   │   └── orchestration.ts     # Environment adaptation
│   │   └── context/
│   │       └── EmotionalStateContext.tsx
│   ├── types/                  # TypeScript definitions
│   └── styles/                 # Global styles
├── src-tauri/                  # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs            # Tauri app entry
│   │   ├── database.rs        # SQLite storage
│   │   └── emotional_api.rs   # System-level API
│   └── tauri.conf.json
└── public/
    └── models/                 # AI model weights (download separately)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Rust** 1.70+ (for Tauri)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/empathos.git
cd empathos

# Install dependencies
npm install

# Download AI models (optional - system works with mock data)
# mkdir -p public/models
# Download emotion detection models to public/models/

# Development mode
npm run dev           # Next.js dev server
npm run tauri:dev     # Tauri desktop app

# Production build
npm run build
npm run tauri:build
```

### Quick Start

1. **Start the application** - Run `npm run dev`
2. **Configure privacy settings** - Go to Settings tab and enable desired detectors
3. **Begin detection** - Click "Start Detection" button
4. **View your state** - Watch real-time emotional state updates
5. **Check insights** - Visit Insights tab for personalized recommendations

## 🧪 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + React | Dashboard UI |
| **Desktop** | Tauri 1.5 | Secure native wrapper |
| **AI/ML** | TensorFlow.js, ONNX Runtime | On-device emotion detection |
| **Storage** | SQLite | Local emotional logs |
| **Sync** | Automerge (CRDTs) | Cross-device synchronization |
| **Visualization** | Recharts | Data visualization |
| **Styling** | Tailwind CSS | Responsive design |

## 📚 Usage Examples

### Accessing Emotional State (JavaScript/TypeScript)

```typescript
import { invoke } from '@tauri-apps/api/tauri'

// Get current emotional state
const state = await invoke('get_emotional_state')
console.log(`Focus: ${state.focus}, Stress: ${state.stress}`)

// Get emotional history
const history = await invoke('get_emotional_history', { limit: 100 })
```

### System-Level API (for other apps)

```typescript
// Request emotional context (requires user permission)
const emotionalContext = await window.EmpathOS.requestContext()

if (emotionalContext.stress > 0.7) {
  // Adapt your app's behavior
  simplifyUI()
  offerHelp()
}
```

## 🎓 Research Applications

EmpathOS generates valuable data on the relationship between emotion and work:

- **Productivity Science** - Correlate emotional states with output quality
- **HCI Research** - Study human-computer interaction patterns
- **Well-being Studies** - Track stress patterns and intervention effectiveness
- **Affective Computing** - Train better emotion recognition models

## 🔐 Privacy & Ethics

### Our Commitments

✅ **Local-First** - All core functionality works offline  
✅ **Transparent** - Open-source code, auditable  
✅ **User Control** - Granular permissions, easy opt-out  
✅ **No Surveillance** - No external data transmission without consent  
✅ **Secure Storage** - Encrypted emotional logs  

### Data Handling

- Emotional states stored locally in SQLite database
- Optional anonymized research contributions (opt-in only)
- Cross-device sync uses end-to-end encrypted CRDTs
- No third-party analytics or tracking

## 🗺️ Roadmap

### Phase 1: Core Foundation ✅
- [x] Basic emotion detection (facial, vocal, behavioral)
- [x] Real-time state modeling engine
- [x] Dashboard UI with visualizations
- [x] Local storage with SQLite
- [x] Tauri desktop wrapper

### Phase 2: Intelligence (In Progress)
- [ ] Advanced AI models (replace mock detectors)
- [ ] Pattern learning & personalization
- [ ] Predictive state modeling
- [ ] Smart orchestration rules engine
- [ ] Notification integration

### Phase 3: Ecosystem
- [ ] Public API for third-party apps
- [ ] Plugin system for custom detectors
- [ ] Cross-device sync with CRDTs
- [ ] Mobile companion app
- [ ] Cloudflare Workers for research aggregation

### Phase 4: Research
- [ ] Anonymized research data platform
- [ ] Academic collaboration framework
- [ ] Published datasets & benchmarks
- [ ] White papers on findings

## 🤝 Contributing

We welcome contributions! Areas where you can help:

- **AI/ML** - Improve emotion detection models
- **UI/UX** - Enhance dashboard and visualizations
- **Privacy** - Security audits and improvements
- **Research** - Validate effectiveness through studies
- **Documentation** - Tutorials, guides, translations

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Affective computing research from MIT Media Lab
- TensorFlow.js team for on-device ML
- Tauri community for secure desktop framework
- Open-source emotion detection models

## 📞 Contact

- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Q&A and community chat
- **Email** - [your-email@example.com]
- **Twitter** - [@EmpathOS]

---

<div align="center">

**Built with ❤️ by researchers who believe technology should understand humans, not the other way around**

[⭐ Star this repo](https://github.com/yourusername/empathos) | [🐛 Report Bug](https://github.com/yourusername/empathos/issues) | [💡 Request Feature](https://github.com/yourusername/empathos/issues)

</div>
