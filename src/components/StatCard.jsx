import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const colorMap = {
  blue:   { accent: 'border-l-blue-500',   icon: 'bg-blue-50 text-blue-600',   ring: 'ring-blue-100' },
  green:  { accent: 'border-l-emerald-500', icon: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
  purple: { accent: 'border-l-violet-500', icon: 'bg-violet-50 text-violet-600', ring: 'ring-violet-100' },
  orange: { accent: 'border-l-amber-500',  icon: 'bg-amber-50 text-amber-600',  ring: 'ring-amber-100' },
  red:    { accent: 'border-l-red-500',    icon: 'bg-red-50 text-red-600',      ring: 'ring-red-100' },
  sky:    { accent: 'border-l-sky-500',    icon: 'bg-sky-50 text-sky-600',      ring: 'ring-sky-100' },
  teal:   { accent: 'border-l-teal-500',   icon: 'bg-teal-50 text-teal-600',    ring: 'ring-teal-100' },
  indigo: { accent: 'border-l-indigo-500', icon: 'bg-indigo-50 text-indigo-600', ring: 'ring-indigo-100' },
}

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, trendValue, delay = 0 }) => {
  const c = colorMap[color] || colorMap.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className={`card border-l-4 ${c.accent} p-5 hover:shadow-card-hover transition-shadow duration-200`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2.5 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend === 'up' ? <FiTrendingUp size={13} /> : <FiTrendingDown size={13} />}
              <span>{trendValue}%</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ring-4 ${c.icon} ${c.ring}`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
