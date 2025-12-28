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
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - Full Height */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? 256 : 80
        }}
        className="bg-white shadow-xl transition-all duration-300 flex flex-col relative z-20 h-full"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h1 className="text-lg font-bold text-primary-600 whitespace-nowrap">
                  Arzaquna
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon size={20} className={isActive(item.href) ? 'text-white' : 'text-gray-600 group-hover:text-primary-600'} />
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
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md"
            >
              {user?.fullName?.charAt(0).toUpperCase()}
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors border border-red-100"
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
          </motion.button>
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

