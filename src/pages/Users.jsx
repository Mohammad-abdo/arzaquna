import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiSearch, FiUserCheck, FiUserX, FiPlus, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi'
import DataTable from '../components/DataTable'

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
          <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-white font-semibold mr-3">
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
      render: (user) => (
        <span className="px-3 py-1.5 inline-flex text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-300">
          {user.role}
        </span>
      )
    },
    {
      header: t('common.status'),
      accessor: 'isActive',
      render: (user) => (
        <span
                      className={`px-3 py-1.5 inline-flex text-xs font-medium rounded-md ${
                        user.isActive 
                          ? 'bg-gray-100 text-gray-700 border border-gray-300' 
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
        >
          {user.isActive ? t('common.active') : t('common.inactive')}
        </span>
      )
    }
  ]

  return (
    <div className="p-8 min-h-screen relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{t('users.title')}</h1>
            <p className="text-gray-600 mt-1 text-lg">{t('users.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/users/create')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150 font-medium"
          >
            <FiPlus size={18} /> {t('users.addUser')}
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
            <input
              type="text"
              placeholder={t('users.searchUsers')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150"
          >
            <option value="">{t('users.allRoles')}</option>
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </motion.div>

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
