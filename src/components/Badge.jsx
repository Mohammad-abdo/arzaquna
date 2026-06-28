const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  brand: 'bg-brand-50 text-brand-800 border-brand-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
}

const Badge = ({ children, variant = 'neutral', dot = false, className = '' }) => (
  <span className={`badge ${variants[variant] || variants.neutral} ${className}`}>
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full me-1.5 ${
        variant === 'success' ? 'bg-emerald-500' :
        variant === 'danger' ? 'bg-red-500' :
        variant === 'warning' ? 'bg-amber-500' :
        'bg-slate-400'
      }`} />
    )}
    {children}
  </span>
)

export default Badge
