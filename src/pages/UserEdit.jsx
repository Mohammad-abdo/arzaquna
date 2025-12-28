import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiShield, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const UserEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'USER',
    isActive: true,
    password: ''
  })

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/users/${id}`)
      if (response.data.success) {
        const user = response.data.data
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'USER',
          isActive: user.isActive !== undefined ? user.isActive : true,
          password: ''
        })
      }
    } catch (error) {
      toast.error('Failed to load user')
      navigate('/users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      }

      // Only include password if it's provided
      if (formData.password && formData.password.length > 0) {
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setSaving(false)
          return
        }
        updateData.password = formData.password
      }

      const response = await api.put(`/admin/users/${id}`, updateData)
      if (response.data.success) {
        toast.success(t('users.userUpdated'))
        navigate('/users')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/users')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{t('users.editUser')}</h1>
            <p className="text-gray-600 mt-1">Edit user information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUser size={18} className="text-primary-600" />
                {t('users.fullName')} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMail size={18} className="text-primary-600" />
                {t('users.email')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiPhone size={18} className="text-primary-600" />
                {t('users.phone')} *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiShield size={18} className="text-primary-600" />
                {t('users.role')} *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
              >
                <option value="USER">User</option>
                <option value="VENDOR">Vendor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                {formData.isActive ? (
                  <FiCheckCircle size={18} className="text-green-600" />
                ) : (
                  <FiXCircle size={18} className="text-red-600" />
                )}
                Account Status
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === true}
                    onChange={() => setFormData({ ...formData, isActive: true })}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === false}
                    onChange={() => setFormData({ ...formData, isActive: false })}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiLock size={18} className="text-primary-600" />
                {t('users.password')} (Leave empty to keep current password)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Enter new password (optional)"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters if provided</p>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
            >
              {saving ? 'Updating...' : t('common.update')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default UserEdit

