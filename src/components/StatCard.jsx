import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.15 }}
      className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors duration-150"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-gray-600' : 'text-gray-600'}`}>
              {trend === 'up' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
              <span>{trendValue}%</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="text-gray-700" size={22} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard


