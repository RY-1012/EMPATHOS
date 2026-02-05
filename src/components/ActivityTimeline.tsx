'use client'

import { useEffect, useState } from 'react'
import { stateModelingEngine } from '@/lib/engine/state-modeling'
import type { EmotionalState } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ActivityTimeline() {
  const [history, setHistory] = useState<EmotionalState[]>([])

  useEffect(() => {
    const updateHistory = () => {
      const recent = stateModelingEngine.getHistory(20)
      setHistory(recent)
    }

    updateHistory()
    const interval = setInterval(updateHistory, 2000)
    return () => clearInterval(interval)
  }, [])

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No activity data yet. Start detection to build your timeline.</p>
      </div>
    )
  }

  const chartData = history.map((state, index) => ({
    time: new Date(state.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    focus: Math.round(state.focus * 100),
    stress: Math.round(state.stress * 100),
    flow: Math.round(state.flow * 100),
    confusion: Math.round(state.confusion * 100),
  }))

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            stroke="currentColor"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="focus" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            name="Focus"
          />
          <Line 
            type="monotone" 
            dataKey="stress" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={false}
            name="Stress"
          />
          <Line 
            type="monotone" 
            dataKey="flow" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={false}
            name="Flow"
          />
          <Line 
            type="monotone" 
            dataKey="confusion" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={false}
            name="Confusion"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Recent Events */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Recent Highlights</h3>
        <div className="space-y-2">
          {history.slice(-5).reverse().map((state, index) => {
            let highlight = ''
            let emoji = '•'
            
            if (state.flow > 0.7) {
              highlight = 'Entered flow state'
              emoji = '🎯'
            } else if (state.stress > 0.7) {
              highlight = 'High stress detected'
              emoji = '⚠️'
            } else if (state.focus > 0.75) {
              highlight = 'Deep focus achieved'
              emoji = '🧘'
            } else if (state.confusion > 0.6) {
              highlight = 'Possible confusion'
              emoji = '🤔'
            }

            if (!highlight) return null

            return (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50"
              >
                <span className="text-xl">{emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{highlight}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(state.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
