import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiEye, FiUser, FiMapPin, FiPhone, FiBriefcase, FiFileText, FiClock } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import FilterTabs from '../components/FilterTabs'

const STATUS_CONFIG = {
  PENDING:  { label: 'Pending',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
}

const DetailModal = ({ app, onClose, onReview }) => {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (status) => {
    setLoading(true)
    try {
      const data = { status }
      if (status === 'REJECTED' && rejectionReason) data.rejectionReason = rejectionReason
      const res = await api.put(`/vendors/applications/${app.id}/review`, data)
      if (res.data.success) {
        toast.success(`Application ${status.toLowerCase()}`)
        onReview()
        onClose()
      }
    } catch {
      toast.error('Failed to review application')
    } finally {
      setLoading(false)
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
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{app.storeName}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_CONFIG[app.status]?.color}`}>{app.status}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiUser size={12} /> Applicant</p>
              <p className="font-semibold text-sm text-gray-900">{app.user?.fullName}</p>
              <p className="text-xs text-gray-500">{app.email}</p>
              <p className="text-xs text-gray-500">{app.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiMapPin size={12} /> Location</p>
              <p className="font-semibold text-sm text-gray-900">{app.city}</p>
              <p className="text-xs text-gray-500">{app.region}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiBriefcase size={12} /> Experience</p>
              <p className="font-semibold text-sm text-gray-900">{app.yearsOfExperience} years</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiPhone size={12} /> WhatsApp</p>
              <p className="font-semibold text-sm text-gray-900">{app.whatsappNumber}</p>
            </div>
          </div>

          {app.rejectionReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
              <p className="text-sm text-gray-700">{app.rejectionReason}</p>
            </div>
          )}

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <FiClock size={12} />
            Applied {new Date(app.createdAt).toLocaleString('en-SA', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>

          {app.status === 'PENDING' && (
            <div className="pt-1">
              {!showReject ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => submit('APPROVED')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <FiCheck size={16} /> Approve
                  </button>
                  <button
                    onClick={() => setShowReject(true)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <FiX size={16} /> Reject
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection (optional)..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowReject(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                    <button
                      onClick={() => submit('REJECTED')}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const VendorApplications = () => {
  const { t } = useTranslation()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => { fetchApplications() }, [page, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/vendors/applications', { params })
      if (res.data.success) {
        setApplications(res.data.data.applications)
        setTotalPages(res.data.data.pagination.pages)
        setTotal(res.data.data.pagination.total)
      }
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'All', value: '' },
  ]

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title={t('sidebar.vendorApplications')}
        subtitle={`${total} ${t('common.results')}`}
        breadcrumbs={[{ label: t('sidebar.vendorApplications') }]}
      />

      <div className="card p-4">
        <FilterTabs tabs={tabs} value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }} />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Store</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-gray-900">{app.storeName}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{app.user?.fullName}</p>
                      <p className="text-xs text-gray-400">{app.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{app.city}, {app.region}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{app.yearsOfExperience} yrs</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'} dot>
                        {STATUS_CONFIG[app.status]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString('en-SA')}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <FiEye size={15} />
                        </button>
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  await api.put(`/vendors/applications/${app.id}/review`, { status: 'APPROVED' })
                                  toast.success('Application approved')
                                  fetchApplications()
                                } catch { toast.error('Failed to approve') }
                              }}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FiCheck size={15} />
                            </button>
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject (with reason)"
                            >
                              <FiX size={15} />
                            </button>
                          </>
                        )}
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
        {selectedApp && (
          <DetailModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onReview={fetchApplications}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default VendorApplications
