// Core Types for EmpathOS

export interface EmotionalState {
  timestamp: Date;
  focus: number;        // 0-1
  stress: number;       // 0-1
  confusion: number;    // 0-1
  flow: number;         // 0-1
  valence: number;      // -1 to 1 (negative to positive emotion)
  arousal: number;      // 0-1 (calm to excited)
  context?: string;
}

export interface DetectorResult {
  confidence: number;
  metrics: Record<string, number>;
  timestamp: Date;
}

export interface FacialEmotionResult extends DetectorResult {
  emotions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  gaze?: {
    x: number;
    y: number;
  };
}

export interface VocalEmotionResult extends DetectorResult {
  pitch: number;
  energy: number;
  speechRate: number;
  emotion: 'calm' | 'excited' | 'stressed' | 'neutral';
}

export interface BehavioralMetrics extends DetectorResult {
  typingSpeed: number;      // words per minute
  errorRate: number;        // 0-1
  mouseMovements: number;   // movements per minute
  clickRate: number;        // clicks per minute
  pauseDuration: number;    // average pause in ms
}

export interface WearableData extends DetectorResult {
  heartRate?: number;
  heartRateVariability?: number;
  skinTemperature?: number;
  accelerometer?: { x: number; y: number; z: number };
}

export interface CognitiveStateModel {
  focus: number;
  stress: number;
  confusion: number;
  flow: number;
  confidence: number;
  sources: Array<'facial' | 'vocal' | 'behavioral' | 'wearable'>;
}

export interface OrchestrationAction {
  type: 'ui-theme' | 'notification' | 'deep-work' | 'assist' | 'suggestion';
  priority: 'low' | 'medium' | 'high';
  payload: any;
  triggeredBy: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  avgFocus: number;
  avgStress: number;
  avgFlow: number;
  notes?: string;
  emotionalStates: EmotionalState[];
}

export interface UserPreferences {
  enableFacialDetection: boolean;
  enableVocalDetection: boolean;
  enableBehavioralTracking: boolean;
  enableWearableIntegration: boolean;
  deepWorkThreshold: number;
  stressThreshold: number;
  notificationMode: 'adaptive' | 'always' | 'never';
  theme: 'auto' | 'light' | 'dark';
  privacyMode: 'strict' | 'balanced' | 'open';
}

export interface EmotionalInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
  relatedData?: any;
}
