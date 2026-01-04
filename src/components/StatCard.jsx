import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-3 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
              <span>{trendValue}%</span>
            </div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
          className={`${color} p-4 rounded-2xl shadow-lg relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Icon className="text-white relative z-10" size={28} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StatCard


