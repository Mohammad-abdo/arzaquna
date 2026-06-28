import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiLayers,
  FiImage,
  FiShoppingCart,
  FiMessageSquare,
  FiFileText,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiCheckCircle,
  FiTrendingUp,
  FiUserPlus,
  FiBell,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'

const Layout = () => {
  const { t, i18n } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { user, logout } = useAuth()
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [isRTL, i18n.language])

  const navigation = [
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: FiHome, group: 'main' },
    { name: t('sidebar.users'), href: '/users', icon: FiUsers, group: 'people' },
    { name: t('sidebar.vendors'), href: '/vendors', icon: FiShoppingBag, group: 'people' },
    { name: t('sidebar.vendorApplications'), href: '/vendor-applications', icon: FiCheckCircle, group: 'people' },
    { name: t('sidebar.adminUsers'), href: '/admin-users', icon: FiUserPlus, group: 'people' },
    { name: t('sidebar.products'), href: '/products', icon: FiPackage, group: 'catalog' },
    { name: t('sidebar.categories'), href: '/categories', icon: FiLayers, group: 'catalog' },
    { name: t('sidebar.sliders'), href: '/sliders', icon: FiImage, group: 'catalog' },
    { name: t('sidebar.statuses'), href: '/statuses', icon: FiTrendingUp, group: 'catalog' },
    { name: t('sidebar.orders'), href: '/orders', icon: FiShoppingCart, group: 'ops' },
    { name: t('sidebar.messages'), href: '/messages', icon: FiMessageSquare, group: 'ops' },
    { name: t('sidebar.notifications'), href: '/notifications', icon: FiBell, group: 'ops' },
    { name: t('sidebar.reports'), href: '/reports', icon: FiBarChart2, group: 'ops' },
    { name: t('sidebar.appContent'), href: '/app-content', icon: FiFileText, group: 'system' },
    { name: t('sidebar.settings'), href: '/settings', icon: FiSettings, group: 'system' },
  ]

  const groups = [
    { key: 'main', label: null },
    { key: 'people', label: sidebarOpen ? t('sidebar.groups.people') : null },
    { key: 'catalog', label: sidebarOpen ? t('sidebar.groups.catalog') : null },
    { key: 'ops', label: sidebarOpen ? t('sidebar.groups.operations') : null },
    { key: 'system', label: sidebarOpen ? t('sidebar.groups.system') : null },
  ]

  const isActive = (href) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  const CollapseIcon = isRTL ? FiChevronRight : FiChevronLeft

  return (
    <div className="flex h-screen overflow-hidden bg-surface-subtle" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 76 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-sidebar flex flex-col relative z-20 h-full flex-shrink-0 shadow-sidebar border-e border-sidebar-border"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'mx-auto' : ''}`}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-sm">أ</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-sm font-bold text-white whitespace-nowrap">أرزقنا</h1>
                  <p className="text-[11px] text-slate-400 whitespace-nowrap">لوحة الإدارة</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-sidebar-hover text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Collapse sidebar"
            >
              <CollapseIcon size={16} />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mx-auto mt-3 p-2 rounded-lg hover:bg-sidebar-hover text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Expand sidebar"
          >
            <FiMenu size={18} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          {groups.map((group) => {
            const items = navigation.filter((n) => n.group === group.key)
            return (
              <div key={group.key} className="mb-1">
                {group.label && (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-3">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          title={!sidebarOpen ? item.name : undefined}
                          className={`sidebar-link relative ${
                            active ? 'sidebar-link-active' : 'sidebar-link-inactive'
                          } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                        >
                          {active && (
                            <span className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-full ${isRTL ? 'right-0' : 'left-0'}`} />
                          )}
                          <Icon size={18} className={`flex-shrink-0 ${active ? 'text-brand-400' : ''}`} />
                          <AnimatePresence>
                            {sidebarOpen && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="whitespace-nowrap truncate"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-slate-600/50">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={logout}
            title={!sidebarOpen ? t('header.logout') : undefined}
            className={`w-full mt-1 sidebar-link sidebar-link-inactive hover:!text-red-400 hover:!bg-red-500/10 ${!sidebarOpen ? 'justify-center px-2' : ''}`}
          >
            <FiLogOut size={16} className="flex-shrink-0" />
            {sidebarOpen && <span>{t('header.logout')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-surface-subtle">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
