# EmpathOS - Emotion-Aware Digital Habitat

## Project Overview
EmpathOS is an open-source, local-first operating system layer that transforms computers into emotionally intelligent partners using on-device AI.

## Technology Stack
- **Frontend**: Next.js 14+ with TypeScript
- **Desktop Wrapper**: Tauri v1.5+
- **AI/ML**: TensorFlow.js, ONNX Runtime
- **Storage**: SQLite (local), CRDTs (sync)
- **Deployment**: Cloudflare Workers (optional research)

## Key Features
1. Multimodal emotion detection (facial, vocal, behavioral, wearable)
2. Real-time cognitive state modeling (focus, stress, confusion, flow)
3. Proactive environment orchestration
4. System-level API for emotional context
5. Privacy-first, local-only processing

## Development Guidelines
- All emotion processing happens on-device
- User privacy is paramount - no data leaves device without explicit consent
- Use TypeScript for type safety
- Follow React best practices for dashboard
- Implement proper error boundaries and fallbacks
- Test all AI models with various inputs

## Architecture Principles
- Local-first: All core functionality works offline
- Privacy-by-design: No cloud dependencies for core features
- Modular: Each emotion detector is independent
- Extensible: Easy to add new detectors or orchestrators
- Performant: Minimal impact on system resources
