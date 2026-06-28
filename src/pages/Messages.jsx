import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiMail, FiSearch, FiX, FiUser, FiMessageSquare, FiAlertCircle, FiHelpCircle, FiInfo } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import FilterTabs from '../components/FilterTabs'

const TYPE_CONFIG = {
  INQUIRY:   { label: 'Inquiry',   icon: FiHelpCircle,   color: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-500' },
  COMPLAINT: { label: 'Complaint', icon: FiAlertCircle,  color: 'bg-red-100 text-red-700 border-red-200',     dot: 'bg-red-500' },
  SUPPORT:   { label: 'Support',   icon: FiMessageSquare,color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  GENERAL:   { label: 'General',   icon: FiInfo,         color: 'bg-gray-100 text-gray-700 border-gray-200',  dot: 'bg-gray-400' },
}

const TypeBadge = ({ type }) => {
  const variantMap = { INQUIRY: 'info', COMPLAINT: 'danger', SUPPORT: 'purple', GENERAL: 'neutral' }
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.GENERAL
  const Icon = cfg.icon
  return (
    <Badge variant={variantMap[type] || 'neutral'}>
      <Icon size={11} className="me-1" />
      {cfg.label}
    </Badge>
  )
}

const MessageDetailModal = ({ message, onClose, onMarkRead }) => {
  const [marking, setMarking] = useState(false)

  const toggleRead = async () => {
    setMarking(true)
    try {
      const res = await api.patch(`/admin/messages/${message.id}/read`)
      if (res.data.success) {
        toast.success(message.isRead ? 'Marked as unread' : 'Marked as read')
        onMarkRead(message.id, !message.isRead)
      }
    } catch {
      // gracefully ignore if endpoint not ready
      onMarkRead(message.id, !message.isRead)
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <TypeBadge type={message.type} />
            {!message.isRead && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {message.subject && (
            <h2 className="font-bold text-gray-900 text-lg">{message.subject}</h2>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiUser size={12} /> From</p>
              <p className="font-semibold text-gray-900 text-sm">{message.sender?.fullName}</p>
              <p className="text-xs text-gray-400 capitalize">{message.sender?.role?.toLowerCase()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiUser size={12} /> To</p>
              <p className="font-semibold text-gray-900 text-sm">{message.receiver?.fullName}</p>
              <p className="text-xs text-gray-400 capitalize">{message.receiver?.role?.toLowerCase()}</p>
            </div>
          </div>

          {message.contentEn && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">English</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{message.contentEn}</p>
            </div>
          )}
          {message.contentAr && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Arabic</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3 text-right font-arabic" dir="rtl">{message.contentAr}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleString('en-SA', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            <button
              onClick={toggleRead}
              disabled={marking}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
            >
              {message.isRead ? 'Mark Unread' : 'Mark as Read'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const Messages = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => { fetchMessages() }, [page, typeFilter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 20 }
      if (typeFilter) params.type = typeFilter
      const res = await api.get('/admin/messages', { params })
      if (res.data.success) {
        setMessages(res.data.data.messages)
        setTotalPages(res.data.data.pagination.pages)
        setTotal(res.data.data.pagination.total)
      }
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = (msgId, isRead) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isRead } : m))
    if (selectedMessage?.id === msgId) setSelectedMessage(prev => ({ ...prev, isRead }))
  }

  const filtered = search
    ? messages.filter(m =>
        m.sender?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase()) ||
        m.contentEn?.toLowerCase().includes(search.toLowerCase())
      )
    : messages

  const unreadCount = messages.filter(m => !m.isRead).length

  const tabs = [
    { label: 'All', value: '' },
    ...Object.entries(TYPE_CONFIG).map(([k, v]) => ({ label: v.label, value: k }))
  ]

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title={t('sidebar.messages')}
        subtitle={`${total} ${t('common.results')}`}
        breadcrumbs={[{ label: t('sidebar.messages') }]}
        badge={unreadCount > 0 ? <Badge variant="info">{unreadCount} new</Badge> : null}
      />

      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FilterTabs tabs={tabs} value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1) }} />
          <div className="relative ms-auto w-full sm:w-64">
            <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search sender, subject..." value={search} onChange={e => setSearch(e.target.value)} className="input-field ps-9" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FiMail size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((msg, idx) => {
              const typeCfg = TYPE_CONFIG[msg.type] || TYPE_CONFIG.GENERAL
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => setSelectedMessage(msg)}
                  className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${!msg.isRead ? 'bg-sky-50/30' : ''}`}
                >
                  {/* Type dot / unread indicator */}
                  <div className="flex-shrink-0 mt-1 relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${typeCfg.color.split(' ').slice(0,2).join(' ')}`}>
                      {(() => { const Icon = typeCfg.icon; return <Icon size={16} /> })()}
                    </div>
                    {!msg.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm ${!msg.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                        {msg.sender?.fullName}
                      </p>
                      <span className="text-gray-300 text-xs">→</span>
                      <p className="text-xs text-gray-400">{msg.receiver?.fullName}</p>
                      <TypeBadge type={msg.type} />
                    </div>
                    {msg.subject && (
                      <p className={`text-sm ${!msg.isRead ? 'font-medium text-gray-700' : 'text-gray-600'} truncate`}>{msg.subject}</p>
                    )}
                    <p className="text-xs text-gray-400 truncate mt-0.5">{msg.contentEn || msg.contentAr}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('en-SA')}</p>
                    <p className="text-xs text-gray-300">{new Date(msg.createdAt).toLocaleTimeString('en-SA', { hour: '2-digit', minute: '2-digit' })}</p>
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
        {selectedMessage && (
          <MessageDetailModal
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onMarkRead={handleMarkRead}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Messages
