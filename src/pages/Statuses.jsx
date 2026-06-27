import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiX, FiTag } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'

const EMPTY_FORM = {
  vendorId: '',
  productId: '',
  price: '',
  icon: '',
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  image: null
}

const StatusModal = ({ editingStatus, vendors, onClose, onSaved }) => {
  const [formData, setFormData] = useState(
    editingStatus
      ? {
          vendorId: editingStatus.vendorId || '',
          productId: editingStatus.productId || '',
          price: editingStatus.price || '',
          icon: editingStatus.icon || '',
          titleAr: editingStatus.titleAr || '',
          titleEn: editingStatus.titleEn || '',
          descriptionAr: editingStatus.descriptionAr || '',
          descriptionEn: editingStatus.descriptionEn || '',
          image: null
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.vendorId || !formData.price) {
      toast.error('Vendor and price are required')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') fd.append(k, v)
      })
      if (editingStatus) {
        await api.put(`/statuses/${editingStatus.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Status updated')
      } else {
        await api.post('/admin/statuses', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Status created')
      }
      onSaved()
      onClose()
    } catch {
      toast.error('Failed to save status')
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{editingStatus ? 'Edit Status/Offer' : 'Add Status/Offer'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Vendor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vendor *</label>
            <select
              value={formData.vendorId}
              onChange={e => set('vendorId', e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Select Vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.storeName} — {v.user?.fullName}</option>
              ))}
            </select>
          </div>

          {/* Price + Product ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (SAR) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => set('price', e.target.value)}
                required
                placeholder="e.g. 5000"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon (emoji/code)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={e => set('icon', e.target.value)}
                placeholder="🐪"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Arabic / English title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arabic Title</label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={e => set('titleAr', e.target.value)}
                dir="rtl"
                placeholder="ناقة بكر للبيع"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Title</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={e => set('titleEn', e.target.value)}
                placeholder="Young camel for sale"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arabic Description</label>
              <textarea
                value={formData.descriptionAr}
                onChange={e => set('descriptionAr', e.target.value)}
                rows={3}
                dir="rtl"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Description</label>
              <textarea
                value={formData.descriptionEn}
                onChange={e => set('descriptionEn', e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Image {!editingStatus && '*'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => set('image', e.target.files[0])}
              required={!editingStatus}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-700"
            />
            {editingStatus && editingStatus.image && (
              <p className="text-xs text-gray-400 mt-1">Current image will be kept if no new file is selected</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {editingStatus ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const Statuses = () => {
  const [statuses, setStatuses] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)

  useEffect(() => {
    fetchStatuses()
  }, [page])

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchStatuses = async () => {
    try {
      setLoading(true)
      const res = await api.get('/statuses', { params: { page, limit: 12 } })
      if (res.data.success) {
        setStatuses(res.data.data.statuses)
        setTotalPages(res.data.data.pagination.pages)
        setTotal(res.data.data.pagination.total || res.data.data.statuses.length)
      }
    } catch {
      toast.error('Failed to load statuses')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors', { params: { limit: 100 } })
      if (res.data.success) setVendors(res.data.data.vendors)
    } catch {
      console.error('Failed to load vendors')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this status/offer?')) return
    try {
      await api.delete(`/statuses/${id}`)
      toast.success('Deleted')
      fetchStatuses()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const openAdd = () => { setEditingStatus(null); setShowModal(true) }
  const openEdit = (s) => { setEditingStatus(s); setShowModal(true) }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statuses & Offers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total entries</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <FiPlus size={16} /> Add Status
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : statuses.length === 0 ? (
          <div className="p-12 text-center">
            <FiTag size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No statuses found</p>
            <button onClick={openAdd} className="mt-3 text-sm text-sky-600 hover:underline">Add the first one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((s, idx) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      {s.image ? (
                        <img src={getImageUrl(s.image)} alt={s.titleEn} className="w-12 h-12 object-cover rounded-xl" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                          {s.icon || '🐾'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{s.titleEn || '—'}</p>
                      <p className="text-xs text-gray-400 text-right" dir="rtl">{s.titleAr || ''}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{s.vendor?.storeName || s.vendor?.user?.fullName || 'N/A'}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">{Number(s.price).toLocaleString()} SAR</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString('en-SA')}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
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
        {showModal && (
          <StatusModal
            editingStatus={editingStatus}
            vendors={vendors}
            onClose={() => setShowModal(false)}
            onSaved={fetchStatuses}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Statuses
