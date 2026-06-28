import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'
import PageHeader from '../components/PageHeader'

const EMPTY_FORM = { titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', icon: '', link: '', order: 0, image: null }

const SliderModal = ({ editingSlider, onClose, onSaved }) => {
  const [formData, setFormData] = useState(
    editingSlider ? { ...EMPTY_FORM, ...editingSlider, image: null } : EMPTY_FORM
  )
  const [preview, setPreview] = useState(editingSlider?.image ? getImageUrl(editingSlider.image) : null)
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      set('image', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titleAr || !formData.titleEn) {
      toast.error('Both Arabic and English titles are required')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v)
      })
      if (editingSlider) {
        await api.put(`/sliders/${editingSlider.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Slider updated')
      } else {
        await api.post('/sliders', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Slider created')
      }
      onSaved()
      onClose()
    } catch {
      toast.error('Failed to save slider')
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
          <h2 className="font-bold text-gray-900 text-lg">{editingSlider ? 'Edit Slider' : 'Add Slider'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arabic Title *</label>
              <input type="text" value={formData.titleAr} onChange={e => set('titleAr', e.target.value)} required dir="rtl"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Title *</label>
              <input type="text" value={formData.titleEn} onChange={e => set('titleEn', e.target.value)} required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arabic Description</label>
              <textarea value={formData.descriptionAr} onChange={e => set('descriptionAr', e.target.value)} rows={3} dir="rtl"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Description</label>
              <textarea value={formData.descriptionEn} onChange={e => set('descriptionEn', e.target.value)} rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon</label>
              <input type="text" value={formData.icon} onChange={e => set('icon', e.target.value)} placeholder="🐪"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link URL</label>
              <input type="text" value={formData.link} onChange={e => set('link', e.target.value)} placeholder="/category/camels"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
              <input type="number" value={formData.order} onChange={e => set('order', parseInt(e.target.value) || 0)} min={0}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image {!editingSlider && '*'}</label>
            {preview && (
              <div className="relative inline-block mb-3">
                <img src={preview} alt="Preview" className="w-48 h-28 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => { set('image', null); setPreview(null) }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <FiX size={14} />
                </button>
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition-colors text-sm text-gray-600">
              <FiUpload size={16} />
              {preview ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageChange} required={!editingSlider && !preview} className="hidden" />
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {editingSlider ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const Sliders = () => {
  const { t } = useTranslation()
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlider, setEditingSlider] = useState(null)

  useEffect(() => { fetchSliders() }, [])

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/sliders/all')
      if (res.data.success) setSliders(res.data.data)
    } catch {
      toast.error('Failed to load sliders')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slider?')) return
    try {
      await api.delete(`/sliders/${id}`)
      toast.success('Slider deleted')
      fetchSliders()
    } catch {
      toast.error('Failed to delete slider')
    }
  }

  const openAdd = () => { setEditingSlider(null); setShowModal(true) }
  const openEdit = (s) => { setEditingSlider(s); setShowModal(true) }

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title={t('sidebar.sliders')}
        subtitle={`${sliders.length} slider${sliders.length !== 1 ? 's' : ''}`}
        breadcrumbs={[{ label: t('sidebar.sliders') }]}
        actions={
          <button onClick={openAdd} className="btn-primary">
            <FiPlus size={16} /> Add Slider
          </button>
        }
      />

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : sliders.length === 0 ? (
        <div className="card p-16 text-center">
          <FiImage size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No sliders yet</p>
          <button onClick={openAdd} className="mt-3 text-sm text-brand-700 hover:underline">Add the first slider</button>
        </div>
      ) : (
        <div className="space-y-3">
          {sliders
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((slider, idx) => (
              <motion.div
                key={slider.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow"
              >
                {slider.image ? (
                  <img src={getImageUrl(slider.image)} alt={slider.titleEn} className="w-32 h-20 object-cover rounded-xl flex-shrink-0" />
                ) : (
                  <div className="w-32 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                    {slider.icon || '🖼️'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900">{slider.titleEn}</p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">#{slider.order ?? idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-500 text-right" dir="rtl">{slider.titleAr}</p>
                  {slider.descriptionEn && <p className="text-xs text-gray-400 mt-1 truncate">{slider.descriptionEn}</p>}
                  {slider.link && <p className="text-xs text-sky-500 mt-0.5 truncate">{slider.link}</p>}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(slider)} className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors" title="Edit">
                    <FiEdit size={16} />
                  </button>
                  <button onClick={() => handleDelete(slider.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <SliderModal
            editingSlider={editingSlider}
            onClose={() => setShowModal(false)}
            onSaved={fetchSliders}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Sliders
