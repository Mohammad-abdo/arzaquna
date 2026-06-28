import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiEdit, FiLayers, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'
import PageHeader from '../components/PageHeader'
import PageLoading from '../components/PageLoading'
import Badge from '../components/Badge'
import DetailField from '../components/DetailField'

const CategoryView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)

  useEffect(() => { fetchCategory() }, [id])

  const fetchCategory = async () => {
    try {
      const response = await api.get(`/categories/${id}`)
      if (response.data.success) setCategory(response.data.data)
    } catch {
      toast.error('Failed to load category')
      navigate('/categories')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async () => {
    try {
      await api.put(`/categories/${category.id}`, { isActive: !category.isActive })
      toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`)
      fetchCategory()
    } catch {
      toast.error('Failed to update category status')
    }
  }

  if (loading) return <PageLoading />
  if (!category) {
    return (
      <div className="page-shell">
        <div className="card p-12 text-center text-slate-500">Category not found</div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <PageHeader
        title={category.nameEn}
        subtitle={category.nameAr}
        breadcrumbs={[{ label: t('sidebar.categories'), href: '/categories' }, { label: category.nameEn }]}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={toggleStatus} className={category.isActive ? 'btn-secondary' : 'btn-primary'}>
              {category.isActive ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
              {category.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => navigate(`/categories/${id}/edit`)} className="btn-primary">
              <FiEdit size={16} /> {t('common.edit')}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <FiLayers size={16} className="text-brand-600" /> Category Information
          </h2>
          <div className="space-y-5">
            <DetailField label="English Name" value={category.nameEn} />
            <DetailField label="Arabic Name" value={category.nameAr} />
            {category.icon && <DetailField label="Icon" value={category.icon} />}
          </div>
        </div>
        <div className="card p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <div className="space-y-4">
            <DetailField label="Category Status">
              <Badge variant={category.isActive ? 'success' : 'danger'} dot>
                {category.isActive ? t('common.active') : t('common.inactive')}
              </Badge>
            </DetailField>
            {category.image && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Image</label>
                <img src={getImageUrl(category.image)} alt={category.nameEn} className="w-full h-44 object-cover rounded-lg border border-slate-200" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryView
