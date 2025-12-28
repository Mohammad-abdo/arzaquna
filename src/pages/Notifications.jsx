import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiSend, FiSearch } from 'react-icons/fi'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    userId: '',
    type: 'MESSAGE',
    titleAr: '',
    titleEn: '',
    messageAr: '',
    messageEn: ''
  })
  const [filters, setFilters] = useState({
    type: '',
    userId: '',
    isRead: ''
  })

  useEffect(() => {
    fetchNotifications()
    fetchUsers()
  }, [page, filters])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 20, ...filters }
      Object.keys(params).forEach(key => params[key] === '' && delete params[key])
      
      const response = await api.get('/admin/notifications', { params })
      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', { params: { limit: 100 } })
      if (response.data.success) {
        setUsers(response.data.data.users)
      }
    } catch (error) {
      console.error('Failed to load users')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/notifications', formData)
      toast.success('Notification sent successfully')
      setShowModal(false)
      setFormData({
        userId: '',
        type: 'MESSAGE',
        titleAr: '',
        titleEn: '',
        messageAr: '',
        messageEn: ''
      })
      fetchNotifications()
    } catch (error) {
      toast.error('Failed to send notification')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiSend /> Send Notification
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filters.type}
              onChange={(e) => {
                setFilters({ ...filters, type: e.target.value })
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Types</option>
              <option value="ORDER">Order</option>
              <option value="OFFER">Offer</option>
              <option value="MESSAGE">Message</option>
            </select>
          </div>
          <select
            value={filters.userId}
            onChange={(e) => {
              setFilters({ ...filters, userId: e.target.value })
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
          <select
            value={filters.isRead}
            onChange={(e) => {
              setFilters({ ...filters, isRead: e.target.value })
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{notification.titleEn}</p>
                      <p className="text-sm text-gray-600">{notification.titleAr}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        To: {notification.user.fullName} ({notification.user.role})
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-gray-700">{notification.messageEn}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                    {notification.isRead && (
                      <span className="ml-2 text-green-600">✓ Read</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Send Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User *</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="ORDER">Order</option>
                  <option value="OFFER">Offer</option>
                  <option value="MESSAGE">Message</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Arabic Title *</label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">English Title *</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Arabic Message *</label>
                  <textarea
                    value={formData.messageAr}
                    onChange={(e) => setFormData({ ...formData, messageAr: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">English Message *</label>
                  <textarea
                    value={formData.messageEn}
                    onChange={(e) => setFormData({ ...formData, messageEn: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications



