import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiSend, FiSearch, FiX, FiTrash2, FiBell, FiRadio, FiUser, FiCheck } from 'react-icons/fi'

const TYPE_CONFIG = {
  ORDER:   { color: 'bg-orange-100 text-orange-700 border-orange-200' },
  OFFER:   { color: 'bg-purple-100 text-purple-700 border-purple-200' },
  MESSAGE: { color: 'bg-sky-100 text-sky-700 border-sky-200' },
}

const EMPTY_FORM = { userId: '', type: 'MESSAGE', titleAr: '', titleEn: '', messageAr: '', messageEn: '' }

const SendModal = ({ users, onClose, onSent }) => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [mode, setMode] = useState('single') // 'single' | 'broadcast'
  const [sending, setSending] = useState(false)
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titleAr || !formData.titleEn || !formData.messageAr || !formData.messageEn) {
      toast.error('All title and message fields are required')
      return
    }
    if (mode === 'single' && !formData.userId) {
      toast.error('Please select a user')
      return
    }
    setSending(true)
    try {
      if (mode === 'broadcast') {
        const res = await api.post('/admin/notifications/broadcast', formData)
        if (res.data.success) toast.success(`Broadcast sent to ${res.data.count} users`)
      } else {
        await api.post('/admin/notifications', formData)
        toast.success('Notification sent')
      }
      onSent()
      onClose()
    } catch {
      toast.error('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Send Notification</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button type="button" onClick={() => setMode('single')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'single' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <FiUser size={14} /> Single User
            </button>
            <button type="button" onClick={() => setMode('broadcast')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'broadcast' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <FiRadio size={14} /> Broadcast All
            </button>
          </div>

          {mode === 'single' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">User *</label>
              <select value={formData.userId} onChange={e => set('userId', e.target.value)} required={mode === 'single'}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500">
                <option value="">Select User</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>)}
              </select>
            </div>
          )}

          {mode === 'broadcast' && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-700 flex items-center gap-2">
              <FiRadio size={16} /> This will send to all active users
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type *</label>
            <select value={formData.type} onChange={e => set('type', e.target.value)} required
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500">
              <option value="MESSAGE">Message</option>
              <option value="ORDER">Order</option>
              <option value="OFFER">Offer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arabic Title *</label>
              <input type="text" value={formData.titleAr} onChange={e => set('titleAr', e.target.value)} required dir="rtl"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Title *</label>
              <input type="text" value={formData.titleEn} onChange={e => set('titleEn', e.target.value)} required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arabic Message *</label>
              <textarea value={formData.messageAr} onChange={e => set('messageAr', e.target.value)} required rows={4} dir="rtl"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Message *</label>
              <textarea value={formData.messageEn} onChange={e => set('messageEn', e.target.value)} required rows={4}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={sending}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2">
              {sending && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <FiSend size={14} /> {mode === 'broadcast' ? 'Broadcast' : 'Send'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchNotifications() }, [page, typeFilter, readFilter])
  useEffect(() => { fetchUsers() }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 20 }
      if (typeFilter) params.type = typeFilter
      if (readFilter !== '') params.isRead = readFilter
      const res = await api.get('/admin/notifications', { params })
      if (res.data.success) {
        setNotifications(res.data.data.notifications)
        setTotalPages(res.data.data.pagination.pages)
        setTotal(res.data.data.pagination.total)
      }
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users', { params: { limit: 200 } })
      if (res.data.success) setUsers(res.data.data.users)
    } catch { /* silent */ }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return
    try {
      await api.delete(`/admin/notifications/${id}`)
      toast.success('Deleted')
      setNotifications(prev => prev.filter(n => n.id !== id))
      setTotal(t => t - 1)
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const handleToggleRead = async (notification) => {
    try {
      await api.patch(`/admin/notifications/${notification.id}/read`)
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: !n.isRead } : n))
    } catch {
      toast.error('Failed to update notification')
    }
  }

  const filtered = search
    ? notifications.filter(n =>
        n.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        n.titleEn?.toLowerCase().includes(search.toLowerCase())
      )
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <span className="px-2 py-0.5 text-xs font-bold bg-sky-500 text-white rounded-full">{unreadCount} unread</span>}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total notifications</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
          <FiSend size={16} /> Send Notification
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1.5">
          {[{ l: 'All', v: '' }, { l: 'Order', v: 'ORDER' }, { l: 'Offer', v: 'OFFER' }, { l: 'Message', v: 'MESSAGE' }].map(t => (
            <button key={t.v} onClick={() => { setTypeFilter(t.v); setPage(1) }}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${typeFilter === t.v ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[{ l: 'All', v: '' }, { l: 'Unread', v: 'false' }, { l: 'Read', v: 'true' }].map(t => (
            <button key={t.v} onClick={() => { setReadFilter(t.v); setPage(1) }}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${readFilter === t.v ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-56">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user or title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 bg-white" />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FiBell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((n, idx) => {
              const typeCfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.MESSAGE
              return (
                <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                  className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-sky-50/30' : ''}`}>
                  <div className="flex-shrink-0 mt-0.5 relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${typeCfg.color.split(' ').slice(0,2).join(' ')}`}>
                      <FiBell size={15} />
                    </div>
                    {!n.isRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.titleEn}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${typeCfg.color}`}>{n.type}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">To: {n.user?.fullName} <span className="text-gray-300">·</span> {n.user?.role}</p>
                    <p className="text-sm text-gray-600 truncate">{n.messageEn}</p>
                  </div>

                  <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
                    <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString('en-SA')}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggleRead(n)}
                        title={n.isRead ? 'Mark unread' : 'Mark read'}
                        className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        <FiCheck size={13} />
                      </button>
                      <button onClick={() => handleDelete(n.id)} title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <SendModal users={users} onClose={() => setShowModal(false)} onSent={fetchNotifications} />}
      </AnimatePresence>
    </div>
  )
}

export default Notifications
