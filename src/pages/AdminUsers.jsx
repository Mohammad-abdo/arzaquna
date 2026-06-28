import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiX, FiSearch, FiTrash2, FiUsers, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import FilterTabs from '../components/FilterTabs'

const ROLE_COLORS = {
  ADMIN:  'bg-purple-100 text-purple-700 border-purple-200',
  VENDOR: 'bg-sky-100 text-sky-700 border-sky-200',
  USER:   'bg-gray-100 text-gray-600 border-gray-200',
}

const EMPTY_FORM = { fullName: '', email: '', phone: '', password: '', role: 'ADMIN' }

const UserModal = ({ onClose, onSaved }) => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/admin/users', formData)
      toast.success('Admin user created')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Create Admin User</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {[
            { key: 'fullName', label: 'Full Name', type: 'text' },
            { key: 'email',    label: 'Email',     type: 'email' },
            { key: 'phone',    label: 'Phone',     type: 'tel' },
            { key: 'password', label: 'Password',  type: 'password', min: 6 },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label} *</label>
              <input type={f.type} value={formData[f.key]} onChange={e => set(f.key, e.target.value)} required minLength={f.min}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role *</label>
            <select value={formData.role} onChange={e => set('role', e.target.value)} required
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none">
              <option value="ADMIN">Admin</option>
              <option value="VENDOR">Vendor</option>
              <option value="USER">User</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const AdminUsers = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ADMIN')

  useEffect(() => { fetchUsers() }, [page, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 20 }
      if (roleFilter) params.role = roleFilter
      const res = await api.get('/admin/users', { params })
      if (res.data.success) {
        setUsers(res.data.data.users)
        setTotalPages(res.data.data.pagination?.pages || 1)
        setTotal(res.data.data.pagination?.total || res.data.data.users.length)
      }
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole })
      toast.success('Role updated')
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { isActive: !user.isActive })
      toast.success(user.isActive ? 'User deactivated' : 'User activated')
      fetchUsers()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.fullName}"? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${user.id}`)
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u.id !== user.id))
      setTotal(t => t - 1)
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const filtered = search
    ? users.filter(u =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users

  const roleTabs = [
    { label: 'All', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Vendor', value: 'VENDOR' },
    { label: 'User', value: 'USER' },
  ]

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title={t('sidebar.adminUsers')}
        subtitle={`${total} ${t('common.results')}`}
        breadcrumbs={[{ label: t('sidebar.adminUsers') }]}
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <FiPlus size={16} /> Add Admin User
          </button>
        }
      />

      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FilterTabs tabs={roleTabs} value={roleFilter} onChange={(v) => { setRoleFilter(v); setPage(1) }} />
          <div className="relative ms-auto w-full sm:w-56">
            <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." className="input-field ps-9" />
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
            <FiUsers size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['User', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user, idx) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-purple-700">{user.fullName?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer bg-transparent ${ROLE_COLORS[user.role] || ROLE_COLORS.USER}`}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="VENDOR">VENDOR</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.isActive ? 'success' : 'danger'} dot>
                        {user.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggleStatus(user)}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                          {user.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                        </button>
                        <button onClick={() => handleDelete(user)} title="Delete user"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
        {showModal && <UserModal onClose={() => setShowModal(false)} onSaved={fetchUsers} />}
      </AnimatePresence>
    </div>
  )
}

export default AdminUsers
