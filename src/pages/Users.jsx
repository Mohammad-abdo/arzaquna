import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiSearch, FiUserCheck, FiUserX, FiPlus, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'

const Users = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [page, search, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter

      const response = await api.get('/users', { params })
      if (response.data.success) {
        setUsers(response.data.data.users)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }


  const handleEdit = (user) => {
    navigate(`/users/${user.id}/edit`)
  }

  const handleView = (user) => {
    navigate(`/users/${user.id}`)
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`${t('users.confirmDelete')} ${user.fullName}?`)) return

    try {
      await api.delete(`/admin/users/${user.id}`)
      toast.success(t('users.userDeleted'))
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleBlock = async (user) => {
    if (!window.confirm(`Block ${user.fullName}?`)) return
    try {
      const response = await api.put(`/admin/users/${user.id}/block`)
      if (response.data.success) {
        toast.success('User blocked successfully')
        fetchUsers()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to block user')
    }
  }

  const handleUnblock = async (user) => {
    try {
      const response = await api.put(`/admin/users/${user.id}/unblock`)
      if (response.data.success) {
        toast.success('User unblocked successfully')
        fetchUsers()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unblock user')
    }
  }

  const columns = [
    {
      header: t('users.fullName'),
      accessor: 'fullName',
      icon: FiUser,
      render: (user) => (
        <div className="flex items-center">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-semibold me-3">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{user.fullName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <FiMail size={12} />
              {user.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('users.phone'),
      accessor: 'phone',
      icon: FiPhone,
      render: (user) => (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FiPhone size={16} className="text-gray-400" />
          {user.phone}
        </div>
      )
    },
    {
      header: t('users.role'),
      accessor: 'role',
      icon: FiShield,
      render: (user) => {
        const roleVariant = { ADMIN: 'purple', VENDOR: 'info', USER: 'neutral' }
        return (
          <Badge variant={roleVariant[user.role] || 'neutral'}>{user.role}</Badge>
        )
      }
    },
    {
      header: t('common.status'),
      accessor: 'isActive',
      render: (user) => (
        <Badge variant={user.isActive ? 'success' : 'danger'} dot>
          {user.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      )
    }
  ]

  return (
    <div className="page-shell">
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        breadcrumbs={[{ label: t('users.title') }]}
        actions={
          <button onClick={() => navigate('/users/create')} className="btn-primary">
            <FiPlus size={17} /> {t('users.addUser')}
          </button>
        }
      />

      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder={t('users.searchUsers')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="input-field ps-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
            className="select-field sm:min-w-[160px]"
          >
            <option value="">{t('users.allRoles')}</option>
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        pagination={{ page, pages: totalPages }}
        onPageChange={setPage}
        actions={true}
        emptyMessage={t('users.noUsers')}
      />

    </div>
  )
}

export default Users
