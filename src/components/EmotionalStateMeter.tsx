'use client'

import type { EmotionalState } from '@/types'
import { Target, Zap, HelpCircle, Waves } from 'lucide-react'

interface Props {
  state: EmotionalState | null
}

export default function EmotionalStateMeter({ state }: Props) {
  if (!state) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Start detection to see your emotional state</p>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Focus',
      value: state.focus,
      icon: Target,
      color: 'empath-blue',
      description: 'How concentrated you are on your current task',
    },
    {
      label: 'Stress',
      value: state.stress,
      icon: Zap,
      color: 'empath-red',
      description: 'Level of tension or pressure you\'re experiencing',
    },
    {
      label: 'Confusion',
      value: state.confusion,
      icon: HelpCircle,
      color: 'empath-orange',
      description: 'Indicates if you might be stuck or uncertain',
    },
    {
      label: 'Flow',
      value: state.flow,
      icon: Waves,
      color: 'empath-green',
      description: 'That optimal state of deep engagement',
    },
  ]

  const getEmoji = () => {
    if (state.flow > 0.7) return '🎯'
    if (state.stress > 0.7) return '😰'
    if (state.confusion > 0.6) return '🤔'
    if (state.focus > 0.7) return '🧘'
    return '😊'
  }

  const getMoodDescription = () => {
    if (state.flow > 0.7) return 'In the zone!'
    if (state.stress > 0.7) return 'Feeling stressed'
    if (state.confusion > 0.6) return 'Might need help'
    if (state.focus > 0.7) return 'Highly focused'
    return 'Doing well'
  }

  return (
    <div className="space-y-6">
      {/* Overall Mood */}
      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
        <div className="text-6xl mb-2 animate-pulse-slow">{getEmoji()}</div>
        <p className="text-xl font-semibold">{getMoodDescription()}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {new Date(state.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const percentage = Math.round(metric.value * 100)
          
          return (
            <div key={metric.label} className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 text-${metric.color}`} />
                  <span className="font-semibold">{metric.label}</span>
                </div>
                <span className="text-lg font-bold">{percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${metric.color} to-${metric.color} transition-all duration-500 emotion-indicator`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {metric.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Valence & Arousal */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valence</p>
          <p className="text-2xl font-bold">
            {state.valence > 0 ? '😊' : state.valence < -0.3 ? '😔' : '😐'}
          </p>
          <p className="text-xs mt-1">
            {state.valence > 0 ? 'Positive' : state.valence < -0.3 ? 'Negative' : 'Neutral'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arousal</p>
          <p className="text-2xl font-bold">
            {state.arousal > 0.7 ? '⚡' : state.arousal < 0.3 ? '😴' : '🌊'}
          </p>
          <p className="text-xs mt-1">
            {state.arousal > 0.7 ? 'Energized' : state.arousal < 0.3 ? 'Calm' : 'Balanced'}
          </p>
        </div>
      </div>
    </div>
  )
}
