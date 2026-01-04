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
    <div className="flex h-screen overflow-hidden relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }
      `}</style>
      
      {/* Light glassy animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float" style={{ animation: 'float 20s ease-in-out infinite' }}></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl animate-floatReverse" style={{ animation: 'floatReverse 25s ease-in-out infinite', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animation: 'float 30s ease-in-out infinite', animationDelay: '1s' }}></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl animate-floatReverse" style={{ animation: 'floatReverse 22s ease-in-out infinite', animationDelay: '3s' }}></div>
      </div>

      {/* Modern Sidebar - Full Height */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 80
        }}
        className="glass-card shadow-2xl transition-all duration-300 flex flex-col relative z-20 h-full backdrop-blur-xl border-r border-white/30"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/30 bg-white/40 backdrop-blur-md">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <span className="text-white font-bold text-lg">A</span>
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                  Arzaquna
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-white/50 hover:bg-white/70 backdrop-blur-sm transition-all duration-200 shadow-sm"
          >
            {sidebarOpen ? <FiX size={20} className="text-gray-700" /> : <FiMenu size={20} className="text-gray-700" />}
          </motion.button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <ul className="space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      active
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30'
                        : 'text-gray-700 hover:bg-white/60 hover:text-blue-600 bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon 
                      size={22} 
                      className={`relative z-10 ${active ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`}
                    />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap text-sm font-medium relative z-10"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && sidebarOpen && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/30 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
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
                  <p className="text-sm font-bold text-gray-800 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all duration-300 border border-red-200/50 backdrop-blur-sm font-semibold"
          >
            <FiLogOut size={18} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap text-sm"
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

