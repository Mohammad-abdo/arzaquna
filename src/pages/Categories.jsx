import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiLayers, FiImage, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import DataTable from '../components/DataTable'
import { getImageUrl } from '../utils/imageHelper'

const Categories = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get('/categories')
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (category) => {
    navigate(`/categories/${category.id}`)
  }

  const handleEdit = (category) => {
    navigate(`/categories/${category.id}/edit`)
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`${t('categories.confirmDelete')} ${category.nameEn}?`)) return

    try {
      await api.delete(`/categories/${category.id}`)
      toast.success(t('categories.categoryDeleted'))
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const toggleStatus = async (category) => {
    try {
      await api.put(`/categories/${category.id}`, { isActive: !category.isActive })
      toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`)
      fetchCategories()
    } catch (error) {
      toast.error('Failed to update category status')
    }
  }

  const columns = [
    {
      header: t('categories.title'),
      accessor: 'nameEn',
      icon: FiLayers,
      render: (category) => (
        <div className="flex items-center">
          {category.image ? (
            <img
              src={getImageUrl(category.image)}
              alt={category.nameEn}
              className="w-14 h-14 object-cover rounded-lg mr-4 border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-white font-semibold mr-4">
              <FiLayers size={24} />
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900">{category.nameEn}</div>
            <div className="text-xs text-gray-500 mt-1">{category.nameAr}</div>
          </div>
        </div>
      )
    },
    {
      header: t('common.status'),
      accessor: 'isActive',
      icon: FiCheckCircle,
      render: (category) => (
        <span
                      className={`px-3 py-1.5 inline-flex text-xs font-medium rounded-md ${
                        category.isActive
                          ? 'bg-gray-100 text-gray-700 border border-gray-300'
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
        >
          {category.isActive ? t('common.active') : t('common.inactive')}
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
            <h1 className="text-3xl font-semibold text-gray-900">{t('categories.title')}</h1>
            <p className="text-gray-600 mt-1 text-lg">{t('categories.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/categories/create')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150 font-medium"
          >
            <FiPlus size={18} /> {t('categories.addCategory')}
          </button>
        </div>
      </motion.div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={toggleStatus}
        onReject={toggleStatus}
        emptyMessage={t('categories.noCategories')}
      />
    </div>
  )
}

export default Categories
