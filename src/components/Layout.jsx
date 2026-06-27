import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
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
  FiX,
  FiLogOut,
  FiCheckCircle,
  FiTrendingUp,
  FiUserPlus,
  FiBell,
  FiBarChart2,
  FiChevronRight
} from 'react-icons/fi'

const Layout = () => {
  const { t, i18n } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
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
    { key: 'people', label: sidebarOpen ? 'People' : null },
    { key: 'catalog', label: sidebarOpen ? 'Catalog' : null },
    { key: 'ops', label: sidebarOpen ? 'Operations' : null },
    { key: 'system', label: sidebarOpen ? 'System' : null },
  ]

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-gray-900 flex flex-col relative z-20 h-full flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white whitespace-nowrap">Arzaquna</h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarOpen && (
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Toggle button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mx-auto mt-3 p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <FiMenu size={18} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-hide">
          {groups.map((group) => {
            const items = navigation.filter((n) => n.group === group.key)
            return (
              <div key={group.key} className="mb-2">
                {group.label && (
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1 mt-2">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          title={!sidebarOpen ? item.name : undefined}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group relative ${
                            active
                              ? 'bg-sky-500 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <Icon size={18} className="flex-shrink-0" />
                          <AnimatePresence>
                            {sidebarOpen && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="whitespace-nowrap text-sm font-medium overflow-hidden"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {active && sidebarOpen && (
                            <FiChevronRight size={14} className="ml-auto opacity-70" />
                          )}
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
        <div className="border-t border-gray-800 p-3">
          <div className={`flex items-center gap-3 px-2 py-2 mb-1 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={logout}
            title={!sidebarOpen ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150 ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <FiLogOut size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap text-sm font-medium"
                >
                  {t('header.logout')}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export default Layout
