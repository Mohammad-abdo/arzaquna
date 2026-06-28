import { Link } from 'react-router-dom'
import { FiChevronRight, FiHome } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const PageHeader = ({ title, subtitle, breadcrumbs = [], actions, badge }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const Chevron = isRTL ? FiChevronRight : FiChevronRight

  return (
    <div className="mb-6">
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 flex-wrap">
          <Link to="/dashboard" className="hover:text-brand-700 transition-colors flex items-center gap-1">
            <FiHome size={12} />
            <span>{isRTL ? 'الرئيسية' : 'Home'}</span>
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Chevron size={12} className={`text-slate-300 ${isRTL ? 'rotate-180' : ''}`} />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-brand-700 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  )
}

export default PageHeader
