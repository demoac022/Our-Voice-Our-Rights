'use client';

import { motion } from 'framer-motion';

interface PerformanceMetric {
  label: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  comparison?: string
}

interface PerformanceMetricsProps {
  districtId?: string
  metrics?: PerformanceMetric[]
  loading?: boolean
}

export default function PerformanceMetrics({
  districtId,
  metrics = [],
  loading = false,
}: PerformanceMetricsProps) {
  if (!districtId) {
    return (
      <div className="text-center text-gray-500 py-8">
        Please select a district to view its performance
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading district performance...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">{metric.label}</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold text-primary-600">
              {metric.value.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-500">{metric.unit}</span>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            {metric.trend === 'up' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ↑ Increased
              </span>
            )}
            {metric.trend === 'down' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ↓ Decreased
              </span>
            )}
            {metric.trend === 'stable' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                → Stable
              </span>
            )}
            {metric.comparison && (
              <span className="text-sm text-gray-500">
                {metric.comparison}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}