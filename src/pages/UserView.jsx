import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiEdit, FiUser, FiMail, FiPhone, FiShield, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const UserView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`)
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load user')
      navigate('/users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async () => {
    try {
      const response = await api.put(`/users/${user.id}/status`, { isActive: !user.isActive })
      if (response.data.success) {
        toast.success(!user.isActive ? t('users.userActivated') : t('users.userDeactivated'))
        fetchUser()
      }
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/users')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{user.fullName}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleUserStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                user.isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {user.isActive ? <FiXCircle size={18} /> : <FiCheckCircle size={18} />}
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => navigate(`/users/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <FiEdit size={18} />
              {t('common.edit')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiUser className="text-primary-600" size={24} />
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiUser size={16} />
                    Full Name
                  </label>
                  <p className="text-lg font-medium text-gray-800">{user.fullName}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiMail size={16} />
                    Email
                  </label>
                  <p className="text-lg font-medium text-gray-800">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiPhone size={16} />
                    Phone
                  </label>
                  <p className="text-lg font-medium text-gray-800">{user.phone}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiShield size={16} />
                    Role
                  </label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Account Status</label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                    <FiCalendar size={16} />
                    Created At
                  </label>
                  <p className="text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UserView


