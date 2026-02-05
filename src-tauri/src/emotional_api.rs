use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmotionalState {
    pub timestamp: DateTime<Utc>,
    pub focus: f32,        // 0.0 - 1.0
    pub stress: f32,       // 0.0 - 1.0
    pub confusion: f32,    // 0.0 - 1.0
    pub flow: f32,         // 0.0 - 1.0
    pub valence: f32,      // -1.0 to 1.0 (negative to positive)
    pub arousal: f32,      // 0.0 - 1.0 (calm to excited)
    pub context: Option<String>,
}

impl Default for EmotionalState {
    fn default() -> Self {
        EmotionalState {
            timestamp: Utc::now(),
            focus: 0.5,
            stress: 0.3,
            confusion: 0.2,
            flow: 0.4,
            valence: 0.0,
            arousal: 0.5,
            context: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmotionalContext {
    pub app_name: String,
    pub activity_type: String,
    pub duration_seconds: u64,
}
