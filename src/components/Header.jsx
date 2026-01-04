import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
  FiGlobe,
  FiChevronDown,
  FiX
} from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Header = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
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

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
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
    } catch (error) {
      // Silent fail for notifications
      console.error('Failed to fetch notifications:', error)
    }
  }

  const performSearch = async () => {
    try {
      // Search across multiple endpoints with error handling
      const [usersRes, productsRes, vendorsRes] = await Promise.allSettled([
        api.get('/users', { params: { search: searchQuery, limit: 3 } }).catch(() => ({ data: { success: false } })),
        api.get('/products', { params: { search: searchQuery, limit: 3 } }).catch(() => ({ data: { success: false } })),
        api.get('/vendors', { params: { search: searchQuery, limit: 3 } }).catch(() => ({ data: { success: false } }))
      ])

      const results = []
      
      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        usersRes.value.data.data.users.forEach(user => {
          results.push({
            type: 'user',
            id: user.id,
            title: user.fullName,
            subtitle: user.email,
            url: `/users`
          })
        })
      }

      if (productsRes.status === 'fulfilled' && productsRes.value.data.success) {
        productsRes.value.data.data.products.forEach(product => {
          results.push({
            type: 'product',
            id: product.id,
            title: product.nameEn,
            subtitle: product.category?.nameEn || '',
            url: `/products`
          })
        })
      }

      if (vendorsRes.status === 'fulfilled' && vendorsRes.value.data.success) {
        vendorsRes.value.data.data.vendors.forEach(vendor => {
          results.push({
            type: 'vendor',
            id: vendor.id,
            title: vendor.storeName,
            subtitle: vendor.user?.fullName || '',
            url: `/vendors`
          })
        })
      }

      setSearchResults(results)
      setShowSearchResults(results.length > 0)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleSearchResultClick = (result) => {
    navigate(result.url)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    setShowLangMenu(false)
    // Reload to apply RTL/LTR
    window.location.reload()
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const getResultIcon = (type) => {
    switch (type) {
      case 'user':
        return <FiUser className="text-blue-500" size={18} />
      case 'product':
        return <FiSearch className="text-green-500" size={18} />
      case 'vendor':
        return <FiUser className="text-purple-500" size={18} />
      default:
        return <FiSearch size={18} />
    }
  }

  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Global Search */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <div className="relative">
              <FiSearch
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
                  isRTL ? 'right-3' : 'left-3'
                }`}
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.globalSearch')}
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:bg-white transition-colors duration-150 ${
                  isRTL ? 'text-right pr-10 pl-4' : 'text-left'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearchResults(false)
                  }}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                    isRTL ? 'left-3' : 'right-3'
                  }`}
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSearchResultClick(result)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{result.title}</p>
                          <p className="text-xs text-gray-500">{result.subtitle}</p>
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-gray-300 bg-white"
              >
                <FiGlobe size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700 uppercase hidden sm:inline">
                  {currentLanguage}
                </span>
                <FiChevronDown size={14} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full mt-2 ${
                      isRTL ? 'left-0' : 'right-0'
                    } bg-white rounded-lg shadow-lg border border-gray-200 min-w-[140px] z-50 overflow-hidden`}
                  >
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 ${
                        currentLanguage === 'en' ? 'bg-gray-50 text-gray-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span>🇬🇧</span> English
                    </button>
                    <button
                      onClick={() => changeLanguage('ar')}
                      className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 ${
                        currentLanguage === 'ar' ? 'bg-gray-50 text-gray-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span>🇸🇦</span> العربية
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-gray-300 bg-white"
              >
                <FiBell size={18} className="text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full mt-2 ${
                      isRTL ? 'left-0' : 'right-0'
                    } bg-white rounded-lg shadow-lg border border-gray-200 w-80 z-50 flex flex-col`}
                    style={{ maxHeight: '384px' }}
                  >
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">{t('header.notifications')}</h3>
                    </div>
                    <div className="overflow-y-auto flex-1" style={{ maxHeight: '320px' }}>
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={notification.id || index}
                            className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            onClick={() => {
                              navigate('/notifications')
                              setShowNotifications(false)
                            }}
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {notification.titleAr || notification.titleEn || notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.messageAr || notification.messageEn || notification.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          {t('header.noNotifications')}
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            navigate('/notifications')
                            setShowNotifications(false)
                          }}
                          className="w-full text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors duration-150"
                        >
                          {t('common.view')} {t('header.notifications')}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-gray-300 bg-white"
              >
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className={`hidden md:block ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <FiChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full mt-2 ${
                      isRTL ? 'left-0' : 'right-0'
                    } bg-white rounded-lg shadow-lg border border-gray-200 min-w-[220px] z-50 overflow-hidden`}
                  >
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/settings')
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <FiUser size={18} />
                        {t('header.profile')}
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings')
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <FiSettings size={18} />
                        {t('header.settings')}
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                      >
                        <FiLogOut size={18} />
                        {t('header.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

