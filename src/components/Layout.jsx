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
  FiBarChart2
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
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: FiHome },
    { name: t('sidebar.users'), href: '/users', icon: FiUsers },
    { name: t('sidebar.vendors'), href: '/vendors', icon: FiShoppingBag },
    { name: t('sidebar.vendorApplications'), href: '/vendor-applications', icon: FiCheckCircle },
    { name: t('sidebar.products'), href: '/products', icon: FiPackage },
    { name: t('sidebar.categories'), href: '/categories', icon: FiLayers },
    { name: t('sidebar.sliders'), href: '/sliders', icon: FiImage },
    { name: t('sidebar.orders'), href: '/orders', icon: FiShoppingCart },
    { name: t('sidebar.messages'), href: '/messages', icon: FiMessageSquare },
    { name: t('sidebar.appContent'), href: '/app-content', icon: FiFileText },
    { name: t('sidebar.statuses'), href: '/statuses', icon: FiTrendingUp },
    { name: t('sidebar.adminUsers'), href: '/admin-users', icon: FiUserPlus },
    { name: t('sidebar.notifications'), href: '/notifications', icon: FiBell },
    { name: t('sidebar.reports'), href: '/reports', icon: FiBarChart2 },
    { name: t('sidebar.settings'), href: '/settings', icon: FiSettings },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - Full Height */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? 260 : 80
        }}
        className="bg-white border-r border-gray-200 transition-all duration-200 flex flex-col relative z-20 h-full shadow-sm"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                  Arzaquna
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            {sidebarOpen ? <FiX size={18} className="text-gray-600" /> : <FiMenu size={18} className="text-gray-600" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-150 ${
                      active
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={active ? 'text-white' : 'text-gray-600'}
                    />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap text-sm"
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
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-white font-semibold">
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
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          >
            <FiLogOut size={18} />
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

      {/* Main Content Area - Full Width */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
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

