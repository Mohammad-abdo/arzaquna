import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
  FiGlobe,
  FiChevronDown,
  FiX,
} from 'react-icons/fi'
import api from '../utils/api'

const routeTitles = {
  '/dashboard': 'sidebar.dashboard',
  '/users': 'sidebar.users',
  '/vendors': 'sidebar.vendors',
  '/vendor-applications': 'sidebar.vendorApplications',
  '/admin-users': 'sidebar.adminUsers',
  '/products': 'sidebar.products',
  '/categories': 'sidebar.categories',
  '/sliders': 'sidebar.sliders',
  '/statuses': 'sidebar.statuses',
  '/orders': 'sidebar.orders',
  '/messages': 'sidebar.messages',
  '/notifications': 'sidebar.notifications',
  '/reports': 'sidebar.reports',
  '/app-content': 'sidebar.appContent',
  '/settings': 'sidebar.settings',
}

const Header = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)
  const langMenuRef = useRef(null)
  const notificationsRef = useRef(null)

  const currentLanguage = i18n.language
  const isRTL = currentLanguage === 'ar'

  const currentRouteKey = Object.keys(routeTitles).find(
    (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  )
  const pageTitle = currentRouteKey ? t(routeTitles[currentRouteKey]) : t('sidebar.dashboard')

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch()
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchResults(false)
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false)
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) setShowLangMenu(false)
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/admin/notifications', { params: { limit: 5 } })
      if (response.data.success) {
        setNotifications(response.data.data.notifications || [])
      }
    } catch {
      /* silent */
    }
  }

  const performSearch = async () => {
    try {
      const [usersRes, productsRes, vendorsRes] = await Promise.allSettled([
        api.get('/users', { params: { search: searchQuery, limit: 3 } }),
        api.get('/products', { params: { search: searchQuery, limit: 3 } }),
        api.get('/vendors', { params: { search: searchQuery, limit: 3 } }),
      ])

      const results = []
      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        usersRes.value.data.data.users.forEach((u) =>
          results.push({ type: 'user', id: u.id, title: u.fullName, subtitle: u.email, url: '/users' })
        )
      }
      if (productsRes.status === 'fulfilled' && productsRes.value.data.success) {
        productsRes.value.data.data.products.forEach((p) =>
          results.push({ type: 'product', id: p.id, title: p.nameEn, subtitle: p.category?.nameEn || '', url: '/products' })
        )
      }
      if (vendorsRes.status === 'fulfilled' && vendorsRes.value.data.success) {
        vendorsRes.value.data.data.vendors.forEach((v) =>
          results.push({ type: 'vendor', id: v.id, title: v.storeName, subtitle: v.user?.fullName || '', url: '/vendors' })
        )
      }
      setSearchResults(results)
      setShowSearchResults(results.length > 0)
    } catch {
      /* silent */
    }
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    setShowLangMenu(false)
    window.location.reload()
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-header" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="px-5 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Page title */}
        <div className="hidden md:block min-w-0">
          <h2 className="text-base font-bold text-slate-900 truncate">{pageTitle}</h2>
          <p className="text-xs text-slate-500 truncate">
            {isRTL ? 'منصة أرزقنا للإدارة' : 'Arzaquna Administration'}
          </p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <FiSearch
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`}
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.globalSearch')}
            className={`input-field py-2 ${isRTL ? 'pr-9 pl-9' : 'pl-9 pr-9'} bg-slate-50 focus:bg-white`}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchResults(false) }}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}
            >
              <FiX size={16} />
            </button>
          )}

          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full mt-1.5 w-full card max-h-80 overflow-y-auto z-50"
              >
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => { navigate(result.url); setSearchQuery(''); setShowSearchResults(false) }}
                    className="w-full p-3 hover:bg-slate-50 text-start border-b border-slate-100 last:border-0 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FiUser size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                      <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{result.type}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="btn-secondary !py-2 !px-3"
            >
              <FiGlobe size={16} />
              <span className="uppercase text-xs hidden sm:inline">{currentLanguage}</span>
              <FiChevronDown size={12} className="text-slate-400" />
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`absolute top-full mt-1.5 ${isRTL ? 'left-0' : 'right-0'} card min-w-[140px] z-50 overflow-hidden py-1`}
                >
                  <button onClick={() => changeLanguage('en')} className={`w-full px-4 py-2 text-sm text-start hover:bg-slate-50 ${currentLanguage === 'en' ? 'text-brand-700 font-semibold bg-brand-50' : 'text-slate-700'}`}>
                    English
                  </button>
                  <button onClick={() => changeLanguage('ar')} className={`w-full px-4 py-2 text-sm text-start hover:bg-slate-50 ${currentLanguage === 'ar' ? 'text-brand-700 font-semibold bg-brand-50' : 'text-slate-700'}`}>
                    العربية
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-secondary !p-2.5 relative"
            >
              <FiBell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`absolute top-full mt-1.5 ${isRTL ? 'left-0' : 'right-0'} card w-80 z-50 flex flex-col`}
                  style={{ maxHeight: '400px' }}
                >
                  <div className="card-header !py-3">
                    <h3 className="text-sm font-bold text-slate-900">{t('header.notifications')}</h3>
                    <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-xs text-brand-700 hover:text-brand-800 font-medium">
                      {t('common.view')}
                    </Link>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <button
                          key={n.id || i}
                          onClick={() => { navigate('/notifications'); setShowNotifications(false) }}
                          className="w-full p-3 text-start border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">
                            {n.titleAr || n.titleEn || n.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {n.messageAr || n.messageEn || n.message}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">{t('header.noNotifications')}</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 ps-1 pe-2.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-xs">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-start">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500">{user?.role}</p>
              </div>
              <FiChevronDown size={12} className="text-slate-400 hidden sm:block" />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`absolute top-full mt-1.5 ${isRTL ? 'left-0' : 'right-0'} card min-w-[220px] z-50 overflow-hidden`}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => { navigate('/settings'); setShowUserMenu(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                      <FiUser size={16} /> {t('header.profile')}
                    </button>
                    <button onClick={() => { navigate('/settings'); setShowUserMenu(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                      <FiSettings size={16} /> {t('header.settings')}
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button onClick={() => { logout(); setShowUserMenu(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      <FiLogOut size={16} /> {t('header.logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
