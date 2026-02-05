# Contributing to EmpathOS

Thank you for your interest in contributing to EmpathOS! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and constructive
- Assume good intentions
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:

- Use a clear, descriptive title
- Provide detailed explanation of the feature
- Explain why this feature would be useful
- Include mockups/examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if applicable
4. **Update documentation** for any changed behavior
5. **Run tests** to ensure nothing breaks
6. **Submit PR** with clear description

## Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/empathos.git
cd empathos

# Install dependencies
npm install

# Create a branch for your feature
git checkout -b feature/my-new-feature

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Enable strict mode
- Provide type annotations for public APIs
- Avoid `any` type when possible

### Code Style

```typescript
// ✅ Good
export async function detectEmotion(
  image: ImageData
): Promise<FacialEmotionResult> {
  // Implementation
}

// ❌ Bad
export async function detectEmotion(image: any): Promise<any> {
  // Implementation
}
```

### Naming Conventions

- **Components**: PascalCase (`EmotionalStateMeter`)
- **Files**: kebab-case for utils, PascalCase for components
- **Functions**: camelCase (`computeState`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_HISTORY_SIZE`)

### Comments

- Use JSDoc for public APIs
- Explain **why**, not **what** (code should be self-documenting)
- Keep comments up-to-date with code changes

```typescript
/**
 * Computes cognitive state from multimodal inputs using confidence-weighted averaging
 * 
 * @param inputs - Detector results from enabled sources
 * @returns Computed cognitive state model with confidence score
 */
export function computeState(inputs: DetectorInputs): CognitiveStateModel {
  // Implementation
}
```

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── lib/
│   ├── detectors/   # Emotion detection modules
│   ├── engine/      # State modeling & orchestration
│   └── context/     # React context providers
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Areas to Contribute

### 🤖 AI/ML Improvements

- Replace mock detectors with real models
- Optimize model inference performance
- Train better emotion recognition models
- Add new detection modalities

**Skills needed**: TensorFlow.js, ML, Python (training)

### 🎨 UI/UX Enhancements

- Improve dashboard visualizations
- Design better emotion indicators
- Create onboarding experience
- Accessibility improvements

**Skills needed**: React, Tailwind CSS, Design

### 🔒 Privacy & Security

- Security audits
- Implement encryption
- Privacy impact assessments
- GDPR/CCPA compliance

**Skills needed**: Security, Cryptography, Legal

### 📊 Research & Validation

- Validate emotion detection accuracy
- Conduct user studies
- Analyze effectiveness of orchestration
- Publish findings

**Skills needed**: Research methodology, Statistics

### 📚 Documentation

- API documentation
- Tutorials and guides
- Video walkthroughs
- Translations

**Skills needed**: Technical writing

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- facial.test.ts
```

### Writing Tests

```typescript
import { facialDetector } from '@/lib/detectors/facial'

describe('FacialDetector', () => {
  it('should detect emotions from image', async () => {
    await facialDetector.initialize()
    const imageData = createMockImageData()
    
    const result = await facialDetector.detectEmotion(imageData)
    
    expect(result.emotions).toBeDefined()
    expect(result.confidence).toBeGreaterThan(0)
  })
})
```

## Privacy Guidelines

When contributing, ensure:

- **No data leaves device** without explicit user consent
- **Minimal data retention** - only what's necessary
- **User control** over all data collection
- **Transparency** in what's being measured
- **Security** in data storage and transmission

## Review Process

1. **Automated checks** run on PR submission
2. **Code review** by maintainers (usually within 2-3 days)
3. **Feedback & iteration** - address review comments
4. **Approval & merge** - once all checks pass

## Recognition

Contributors will be:

- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Invited to contributor discussions
- Eligible for special badges/recognition

## Questions?

- **GitHub Discussions** - Ask questions, share ideas
- **Discord** - Real-time chat with community
- **Email** - [maintainers@empathos.org]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making EmpathOS better! 🧠❤️
