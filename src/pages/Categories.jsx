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
              className="w-14 h-14 object-cover rounded-xl mr-4 border-2 border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md mr-4">
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
          className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
            category.isActive
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
              : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300'
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{t('categories.title')}</h1>
            <p className="text-gray-600 mt-1 text-lg">{t('categories.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/categories/create')}
            className="flex items-center gap-2 px-5 py-2.5 glass-card text-white rounded-xl hover:bg-white/40 transition-all duration-300 shadow-lg backdrop-blur-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            <FiPlus size={20} /> {t('categories.addCategory')}
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
