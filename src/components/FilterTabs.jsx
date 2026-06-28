const FilterTabs = ({ tabs, value, onChange }) => (
  <div className="flex gap-1.5 flex-wrap">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        onClick={() => onChange(tab.value)}
        className={value === tab.value ? 'tab-btn-active' : 'tab-btn'}
      >
        {tab.label}
        {tab.count != null && (
          <span className={`ms-1.5 text-xs px-1.5 py-0.5 rounded-md ${
            value === tab.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
          }`}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
)

export default FilterTabs
