const DetailField = ({ label, value, icon: Icon, children }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {Icon && <Icon size={14} />}
      {label}
    </label>
    {children || <p className="text-sm font-medium text-slate-900">{value || '—'}</p>}
  </div>
)

export default DetailField
