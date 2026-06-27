import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-500',   text: 'text-blue-600',   trend: 'text-blue-500' },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-500',  text: 'text-green-600',  trend: 'text-green-500' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600', trend: 'text-purple-500' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600', trend: 'text-orange-500' },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-500',    text: 'text-red-600',    trend: 'text-red-500' },
  sky:    { bg: 'bg-sky-50',    icon: 'bg-sky-500',    text: 'text-sky-600',    trend: 'text-sky-500' },
  teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-500',   text: 'text-teal-600',   trend: 'text-teal-500' },
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-500', text: 'text-indigo-600', trend: 'text-indigo-500' },
}

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, trendValue, delay = 0 }) => {
  const c = colorMap[color] || colorMap.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {trend === 'up' ? <FiTrendingUp size={13} /> : <FiTrendingDown size={13} />}
              <span>{trendValue}% this month</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
