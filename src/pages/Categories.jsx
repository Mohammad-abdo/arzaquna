import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiLayers } from 'react-icons/fi'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { getImageUrl } from '../utils/imageHelper'

const Categories = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get('/categories')
      if (response.data.success) setCategories(response.data.data)
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`${t('categories.confirmDelete')} ${category.nameEn}?`)) return
    try {
      await api.delete(`/categories/${category.id}`)
      toast.success(t('categories.categoryDeleted'))
      fetchCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const toggleStatus = async (category) => {
    try {
      await api.put(`/categories/${category.id}`, { isActive: !category.isActive })
      toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`)
      fetchCategories()
    } catch {
      toast.error('Failed to update category status')
    }
  }

  const columns = [
    {
      header: t('categories.title'),
      accessor: 'nameEn',
      icon: FiLayers,
      render: (category) => (
        <div className="flex items-center gap-3">
          {category.image ? (
            <img src={getImageUrl(category.image)} alt={category.nameEn} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white">
              <FiLayers size={20} />
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-slate-900">{category.nameEn}</div>
            <div className="text-xs text-slate-500 mt-0.5">{category.nameAr}</div>
          </div>
        </div>
      ),
    },
    {
      header: t('common.status'),
      accessor: 'isActive',
      render: (category) => (
        <Badge variant={category.isActive ? 'success' : 'danger'} dot>
          {category.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
  ]

  return (
    <div className="page-shell">
      <PageHeader
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        breadcrumbs={[{ label: t('categories.title') }]}
        actions={
          <button onClick={() => navigate('/categories/create')} className="btn-primary">
            <FiPlus size={17} /> {t('categories.addCategory')}
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        onView={(c) => navigate(`/categories/${c.id}`)}
        onEdit={(c) => navigate(`/categories/${c.id}/edit`)}
        onDelete={handleDelete}
        onApprove={toggleStatus}
        onReject={toggleStatus}
        emptyMessage={t('categories.noCategories')}
      />
    </div>
  )
}

export default Categories
