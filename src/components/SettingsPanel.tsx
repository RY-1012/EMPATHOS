'use client'

import { useEmotionalState } from '@/lib/context/EmotionalStateContext'
import { Shield, Eye, Mic, Mouse, Watch } from 'lucide-react'

export default function SettingsPanel() {
  const { preferences, updatePreferences } = useEmotionalState()

  const toggleSetting = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>

      {/* Privacy Section */}
      <section>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-empath-blue" />
          Privacy & Data Collection
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 cursor-pointer hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <div>
                <p className="font-medium">Facial Detection</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyze facial expressions via webcam
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableFacialDetection}
              onChange={() => toggleSetting('enableFacialDetection')}
              className="w-5 h-5 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 cursor-pointer hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5" />
              <div>
                <p className="font-medium">Vocal Detection</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyze vocal tone via microphone
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableVocalDetection}
              onChange={() => toggleSetting('enableVocalDetection')}
              className="w-5 h-5 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 cursor-pointer hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
            <div className="flex items-center gap-3">
              <Mouse className="w-5 h-5" />
              <div>
                <p className="font-medium">Behavioral Tracking</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor typing and mouse patterns
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableBehavioralTracking}
              onChange={() => toggleSetting('enableBehavioralTracking')}
              className="w-5 h-5 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 cursor-pointer hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all">
            <div className="flex items-center gap-3">
              <Watch className="w-5 h-5" />
              <div>
                <p className="font-medium">Wearable Integration</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect fitness trackers for heart rate data
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableWearableIntegration}
              onChange={() => toggleSetting('enableWearableIntegration')}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>
      </section>

      {/* Orchestration Settings */}
      <section>
        <h3 className="font-semibold mb-3">Orchestration Thresholds</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
            <label className="block">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Deep Work Threshold</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(preferences.deepWorkThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.deepWorkThreshold * 100}
                onChange={(e) =>
                  updatePreferences({ deepWorkThreshold: Number(e.target.value) / 100 })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Minimum focus level to trigger deep work mode
              </p>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
            <label className="block">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Stress Alert Threshold</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(preferences.stressThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.stressThreshold * 100}
                onChange={(e) =>
                  updatePreferences({ stressThreshold: Number(e.target.value) / 100 })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Stress level that triggers break suggestions
              </p>
            </label>
          </div>
        </div>
      </section>

      {/* Notification Mode */}
      <section>
        <h3 className="font-semibold mb-3">Notification Mode</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['adaptive', 'always', 'never'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updatePreferences({ notificationMode: mode })}
              className={`p-4 rounded-xl font-medium transition-all ${
                preferences.notificationMode === mode
                  ? 'bg-gradient-to-r from-empath-blue to-empath-purple text-white'
                  : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Privacy Mode */}
      <section>
        <h3 className="font-semibold mb-3">Privacy Mode</h3>
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-empath-blue">Current: {preferences.privacyMode}</strong>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            • <strong>Strict:</strong> All data stays on device, no external connections
            <br />• <strong>Balanced:</strong> Allow anonymized research contributions
            <br />• <strong>Open:</strong> Enable cloud sync across devices
          </p>
        </div>
      </section>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <p className="text-sm">
          <strong>🔒 Privacy First:</strong> All emotion detection happens on your device.
          No data is sent to external servers unless you explicitly enable it.
        </p>
      </div>
    </div>
  )
}
