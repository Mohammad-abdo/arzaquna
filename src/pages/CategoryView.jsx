import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiEdit, FiLayers, FiImage, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'

const CategoryView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    fetchCategory()
  }, [id])

  const fetchCategory = async () => {
    try {
      const response = await api.get(`/categories/${id}`)
      if (response.data.success) {
        setCategory(response.data.data)
      }
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to update category status')
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500">Category not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/categories')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              {category.image ? (
                <img
                  src={getImageUrl(category.image)}
                  alt={category.nameEn}
                  className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                  <FiLayers size={32} />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-800">{category.nameEn}</h1>
                <p className="text-gray-600 mt-1">{category.nameAr}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                category.isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {category.isActive ? <FiXCircle size={18} /> : <FiCheckCircle size={18} />}
              {category.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => navigate(`/categories/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <FiEdit size={18} />
              {t('common.edit')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiLayers className="text-primary-600" size={24} />
                Category Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">English Name</label>
                  <p className="text-lg font-bold text-gray-800">{category.nameEn}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Arabic Name</label>
                  <p className="text-lg font-bold text-gray-800">{category.nameAr}</p>
                </div>
                {category.icon && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Icon</label>
                    <p className="text-lg text-gray-800">{category.icon}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category Status</label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                        category.isActive
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {category.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                </div>
                {category.image && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Image</label>
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.nameEn}
                      className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CategoryView

