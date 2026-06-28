import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiEdit, FiUser, FiMail, FiPhone, FiShield, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import PageLoading from '../components/PageLoading'
import Badge from '../components/Badge'
import DetailField from '../components/DetailField'

const UserView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => { fetchUser() }, [id])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`)
      if (response.data.success) setUser(response.data.data)
    } catch {
      toast.error('Failed to load user')
      navigate('/users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async () => {
    try {
      const response = await api.put(`/admin/users/${user.id}/status`, { isActive: !user.isActive })
      if (response.data.success) {
        toast.success(!user.isActive ? t('users.userActivated') : t('users.userDeactivated'))
        fetchUser()
      }
    } catch {
      toast.error('Failed to update user status')
    }
  }

  if (loading) return <PageLoading />

  if (!user) {
    return (
      <div className="page-shell">
        <div className="card p-12 text-center text-slate-500">User not found</div>
      </div>
    )
  }

  const roleVariant = { ADMIN: 'purple', VENDOR: 'info', USER: 'neutral' }

  return (
    <div className="page-shell">
      <PageHeader
        title={user.fullName}
        subtitle={user.email}
        breadcrumbs={[{ label: t('sidebar.users'), href: '/users' }, { label: user.fullName }]}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={toggleUserStatus} className={user.isActive ? 'btn-secondary' : 'btn-primary'}>
              {user.isActive ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => navigate(`/users/${id}/edit`)} className="btn-primary">
              <FiEdit size={16} /> {t('common.edit')}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FiUser size={16} className="text-brand-600" /> User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DetailField label="Full Name" value={user.fullName} icon={FiUser} />
            <DetailField label="Email" value={user.email} icon={FiMail} />
            <DetailField label="Phone" value={user.phone} icon={FiPhone} />
            <DetailField label="Role" icon={FiShield}>
              <Badge variant={roleVariant[user.role] || 'neutral'}>{user.role}</Badge>
            </DetailField>
          </div>
        </div>

        <div className="card p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <div className="space-y-4">
            <DetailField label="Account Status">
              <Badge variant={user.isActive ? 'success' : 'danger'} dot>
                {user.isActive ? t('common.active') : t('common.inactive')}
              </Badge>
            </DetailField>
            <DetailField
              label="Created At"
              value={new Date(user.createdAt).toLocaleDateString()}
              icon={FiCalendar}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserView
