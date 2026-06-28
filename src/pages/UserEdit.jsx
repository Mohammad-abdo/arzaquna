import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiLock, FiShield, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import PageLoading from '../components/PageLoading'
import FormActions from '../components/FormActions'

const UserEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', role: 'USER', isActive: true, password: '',
  })

  useEffect(() => { fetchUser() }, [id])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`)
      if (response.data.success) {
        const user = response.data.data
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'USER',
          isActive: user.isActive !== undefined ? user.isActive : true,
          password: '',
        })
      }
    } catch {
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
        isActive: formData.isActive,
      }
      if (formData.password) {
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

  const set = (key, val) => setFormData((p) => ({ ...p, [key]: val }))

  if (loading) return <PageLoading />

  return (
    <div className="page-shell">
      <PageHeader
        title={t('users.editUser')}
        subtitle="Edit user information"
        breadcrumbs={[{ label: t('sidebar.users'), href: '/users' }, { label: t('users.editUser') }]}
      />

      <form onSubmit={handleSubmit} className="card p-6 lg:p-8 max-w-2xl">
        <div className="space-y-5">
          {[
            { key: 'fullName', label: t('users.fullName'), type: 'text', icon: FiUser },
            { key: 'email', label: t('users.email'), type: 'email', icon: FiMail },
            { key: 'phone', label: t('users.phone'), type: 'tel', icon: FiPhone },
          ].map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                <f.icon size={16} className="text-brand-600" /> {f.label} *
              </label>
              <input type={f.type} value={formData[f.key]} onChange={(e) => set(f.key, e.target.value)} required className="input-field" />
            </div>
          ))}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
              <FiShield size={16} className="text-brand-600" /> {t('users.role')} *
            </label>
            <select value={formData.role} onChange={(e) => set('role', e.target.value)} required className="select-field w-full">
              <option value="USER">User</option>
              <option value="VENDOR">Vendor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              {formData.isActive ? <FiCheckCircle size={16} className="text-emerald-600" /> : <FiXCircle size={16} className="text-red-500" />}
              Account Status
            </label>
            <div className="flex items-center gap-4">
              {[{ val: true, label: 'Active' }, { val: false, label: 'Inactive' }].map((opt) => (
                <label key={String(opt.val)} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="isActive" checked={formData.isActive === opt.val} onChange={() => set('isActive', opt.val)} className="text-brand-600" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
              <FiLock size={16} className="text-brand-600" /> {t('users.password')}
            </label>
            <input type="password" value={formData.password} onChange={(e) => set('password', e.target.value)} className="input-field" placeholder="Leave empty to keep current" />
            <p className="text-xs text-slate-400 mt-1">Minimum 6 characters if provided</p>
          </div>
        </div>
        <FormActions
          onCancel={() => navigate('/users')}
          submitLabel={t('common.update')}
          loading={saving}
          loadingLabel="Updating..."
        />
      </form>
    </div>
  )
}

export default UserEdit
