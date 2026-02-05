'use client'

import { useEffect, useState } from 'react'
import { stateModelingEngine } from '@/lib/engine/state-modeling'
import type { EmotionalInsight } from '@/types'
import { Lightbulb, TrendingUp, AlertCircle, Award } from 'lucide-react'

export default function InsightsPanel() {
  const [insights, setInsights] = useState<EmotionalInsight[]>([])

  useEffect(() => {
    const generateInsights = () => {
      const avgState = stateModelingEngine.getAverageState(3600000) // Last hour
      if (!avgState) return

      const newInsights: EmotionalInsight[] = []

      // Pattern detection
      if (avgState.flow > 0.6) {
        newInsights.push({
          id: 'pattern-flow',
          type: 'pattern',
          title: 'Flow State Pattern',
          description: `You've been in flow state for the past hour! Your average flow score is ${Math.round(avgState.flow * 100)}%.`,
          confidence: 0.85,
          timestamp: new Date(),
        })
      }

      // Stress patterns
      if (avgState.stress > 0.6) {
        newInsights.push({
          id: 'pattern-stress',
          type: 'recommendation',
          title: 'Elevated Stress Levels',
          description: 'Your stress has been elevated. Consider taking short breaks every 25 minutes.',
          confidence: 0.75,
          timestamp: new Date(),
        })
      }

      // Focus achievement
      if (avgState.focus > 0.7) {
        newInsights.push({
          id: 'achievement-focus',
          type: 'achievement',
          title: 'High Focus Session',
          description: `Excellent focus! You maintained ${Math.round(avgState.focus * 100)}% average focus.`,
          confidence: 0.9,
          timestamp: new Date(),
        })
      }

      // Confusion help
      if (avgState.confusion > 0.5) {
        newInsights.push({
          id: 'recommendation-confusion',
          type: 'recommendation',
          title: 'Confusion Detected',
          description: 'You seem stuck. Try breaking down your task into smaller steps or seeking help.',
          confidence: 0.7,
          timestamp: new Date(),
        })
      }

      setInsights(newInsights)
    }

    generateInsights()
    const interval = setInterval(generateInsights, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: EmotionalInsight['type']) => {
    switch (type) {
      case 'pattern':
        return TrendingUp
      case 'recommendation':
        return Lightbulb
      case 'achievement':
        return Award
      case 'anomaly':
        return AlertCircle
      default:
        return Lightbulb
    }
  }

  const getColor = (type: EmotionalInsight['type']) => {
    switch (type) {
      case 'pattern':
        return 'text-empath-blue'
      case 'recommendation':
        return 'text-empath-orange'
      case 'achievement':
        return 'text-empath-green'
      case 'anomaly':
        return 'text-empath-red'
      default:
        return 'text-gray-600'
    }
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Keep using EmpathOS to generate personalized insights!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Your Insights</h2>

      <div className="grid gap-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type)
          const colorClass = getColor(insight.type)

          return (
            <div
              key={insight.id}
              className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border-l-4 border-empath-blue"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 mt-1 ${colorClass}`} />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="capitalize">{insight.type}</span>
                    <span>•</span>
                    <span>{Math.round(insight.confidence * 100)}% confidence</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Statistics Summary */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <h3 className="font-semibold mb-4">Session Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-empath-blue">
              {stateModelingEngine.getHistory().length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Data Points</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-empath-green">{insights.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Insights</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-empath-purple">
              {insights.filter(i => i.type === 'achievement').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-empath-orange">
              {insights.filter(i => i.type === 'recommendation').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tips</p>
          </div>
        </div>
      </div>
    </div>
  )
}
