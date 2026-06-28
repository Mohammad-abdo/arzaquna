import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiFileText, FiEdit2, FiX, FiSave, FiGlobe } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'

const CONTENT_TYPES = [
  { key: 'ABOUT',             label: 'About App',          icon: FiGlobe },
  { key: 'PRIVACY_POLICY',    label: 'Privacy Policy',     icon: FiFileText },
  { key: 'TERMS_CONDITIONS',  label: 'Terms & Conditions', icon: FiFileText },
]

const EditModal = ({ content, type, label, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    contentAr: content?.contentAr || '',
    contentEn: content?.contentEn || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.contentAr.trim() || !formData.contentEn.trim()) {
      toast.error('Both Arabic and English content are required')
      return
    }
    setSaving(true)
    try {
      await api.put(`/app-content/${type}`, formData)
      toast.success(`${label} updated`)
      onSaved()
      onClose()
    } catch {
      toast.error('Failed to update content')
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900 text-lg">Edit — {label}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-5 p-5 flex-1 overflow-y-auto">
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                Arabic Content <span className="text-xs text-gray-400 font-normal">(RTL)</span>
              </label>
              <textarea value={formData.contentAr} onChange={e => setFormData(p => ({ ...p, contentAr: e.target.value }))}
                required dir="rtl" rows={18}
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none font-arabic leading-relaxed" />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">English Content</label>
              <textarea value={formData.contentEn} onChange={e => setFormData(p => ({ ...p, contentEn: e.target.value }))}
                required rows={18}
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none leading-relaxed" />
            </div>
          </div>
          <div className="flex gap-3 justify-end p-5 border-t border-gray-100 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2">
              {saving
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <FiSave size={14} />
              }
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ContentCard = ({ typeDef, content, onEdit }) => {
  const [tab, setTab] = useState('en')
  const Icon = typeDef.icon
  const text = tab === 'en' ? content?.contentEn : content?.contentAr

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <Icon size={17} className="text-sky-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">{typeDef.label}</h2>
            {content
              ? <p className="text-xs text-gray-400">Last updated: {new Date(content.updatedAt).toLocaleDateString('en-SA')}</p>
              : <p className="text-xs text-amber-500 font-medium">Not configured yet</p>
            }
          </div>
        </div>
        <button onClick={onEdit}
          className="btn-primary !py-2 !px-3.5">
          <FiEdit2 size={13} /> {content ? 'Edit' : 'Create'}
        </button>
      </div>

      {content ? (
        <div className="p-5">
          <div className="flex gap-1.5 mb-4">
            {[{ v: 'en', l: 'English' }, { v: 'ar', l: 'العربية' }].map(t => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === t.v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.l}
              </button>
            ))}
          </div>
          <div className={`max-h-40 overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ${tab === 'ar' ? 'text-right font-arabic' : ''}`}
            dir={tab === 'ar' ? 'rtl' : 'ltr'}>
            {text || <span className="text-gray-400 italic">No content</span>}
          </div>
        </div>
      ) : (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-gray-400">Click "Create" to add this content</p>
        </div>
      )}
    </motion.div>
  )
}

const AppContent = () => {
  const { t } = useTranslation()
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingType, setEditingType] = useState(null)

  useEffect(() => { fetchContents() }, [])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const res = await api.get('/app-content')
      if (res.data.success) setContents(res.data.data)
    } catch {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const editingTypeDef = CONTENT_TYPES.find(t => t.key === editingType)
  const editingContent = contents.find(c => c.type === editingType)

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title={t('sidebar.appContent')}
        subtitle="Manage bilingual app text"
        breadcrumbs={[{ label: t('sidebar.appContent') }]}
      />

      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {CONTENT_TYPES.map(typeDef => (
            <ContentCard
              key={typeDef.key}
              typeDef={typeDef}
              content={contents.find(c => c.type === typeDef.key)}
              onEdit={() => setEditingType(typeDef.key)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {editingType && editingTypeDef && (
          <EditModal
            key={editingType}
            content={editingContent}
            type={editingType}
            label={editingTypeDef.label}
            onClose={() => setEditingType(null)}
            onSaved={fetchContents}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppContent
