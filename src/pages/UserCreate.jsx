import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiLock, FiShield } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import FormActions from '../components/FormActions'

const UserCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', role: 'USER',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/admin/users', formData)
      if (response.data.success) {
        toast.success(t('users.userCreated'))
        navigate('/users')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const set = (key, val) => setFormData((p) => ({ ...p, [key]: val }))

  return (
    <div className="page-shell">
      <PageHeader
        title={t('users.addUser')}
        subtitle="Create a new user account"
        breadcrumbs={[{ label: t('sidebar.users'), href: '/users' }, { label: t('users.addUser') }]}
      />

      <form onSubmit={handleSubmit} className="card p-6 lg:p-8 max-w-2xl">
        <div className="space-y-5">
          {[
            { key: 'fullName', label: t('users.fullName'), type: 'text', icon: FiUser, required: true },
            { key: 'email', label: t('users.email'), type: 'email', icon: FiMail, required: true },
            { key: 'phone', label: t('users.phone'), type: 'tel', icon: FiPhone, required: true },
            { key: 'password', label: t('users.password'), type: 'password', icon: FiLock, required: true },
          ].map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                <f.icon size={16} className="text-brand-600" /> {f.label} *
              </label>
              <input
                type={f.type}
                value={formData[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                required={f.required}
                className="input-field"
              />
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
        </div>
        <FormActions
          onCancel={() => navigate('/users')}
          submitLabel={t('common.create')}
          loading={loading}
          loadingLabel="Creating..."
        />
      </form>
    </div>
  )
}

export default UserCreate
