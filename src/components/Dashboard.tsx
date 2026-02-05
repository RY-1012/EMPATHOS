'use client'

import { useState } from 'react'
import { useEmotionalState } from '@/lib/context/EmotionalStateContext'
import EmotionalStateMeter from './EmotionalStateMeter'
import ActivityTimeline from './ActivityTimeline'
import InsightsPanel from './InsightsPanel'
import SettingsPanel from './SettingsPanel'
import { Brain, Settings, TrendingUp, Activity } from 'lucide-react'

export default function Dashboard() {
  const { currentState, isProcessing, startDetection, stopDetection } = useEmotionalState()
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'settings'>('overview')

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="glass rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🧠</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-empath-blue to-empath-purple bg-clip-text text-transparent">
                EmpathOS
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your Emotion-Aware Digital Habitat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={isProcessing ? stopDetection : startDetection}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                isProcessing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-empath-blue to-empath-purple hover:opacity-90 text-white'
              }`}
            >
              {isProcessing ? '⏸️ Pause' : '▶️ Start Detection'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="glass rounded-2xl p-2 mb-6 inline-flex gap-2 shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-800 shadow-md'
              : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span className="font-medium">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'insights'
              ? 'bg-white dark:bg-slate-800 shadow-md'
              : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Insights</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-slate-800 shadow-md'
              : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Current State */}
            <div className="glass rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-empath-blue" />
                Current State
              </h2>
              <EmotionalStateMeter state={currentState} />
            </div>

            {/* Activity Timeline */}
            <div className="glass rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Activity Timeline</h2>
              <ActivityTimeline />
            </div>
          </>
        )}

        {activeTab === 'insights' && (
          <div className="glass rounded-2xl p-6 shadow-lg">
            <InsightsPanel />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass rounded-2xl p-6 shadow-lg">
            <SettingsPanel />
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="glass rounded-xl p-4 inline-block">
          🔒 All emotion processing happens on your device. No data leaves your computer.
        </div>
      </footer>
    </div>
  )
}
