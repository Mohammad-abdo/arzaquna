import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiUpload, FiImage, FiLayers, FiX } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'
import PageHeader from '../components/PageHeader'
import PageLoading from '../components/PageLoading'
import FormActions from '../components/FormActions'

const CategoryCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    icon: '',
    image: null
  })
  const [existingImage, setExistingImage] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (isEditMode) {
      fetchCategory()
    }
  }, [id])

  const fetchCategory = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/categories/${id}`)
      if (response.data.success) {
        const category = response.data.data
        setFormData({
          nameAr: category.nameAr || '',
          nameEn: category.nameEn || '',
          icon: category.icon || ''
        })
        if (category.image) {
          setExistingImage(getImageUrl(category.image))
          setPreview(getImageUrl(category.image))
        }
      }
    } catch (error) {
      toast.error('Failed to load category')
      navigate('/categories')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setPreview(URL.createObjectURL(file))
      setExistingImage(null) // Clear existing image when new one is selected
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setPreview(null)
    setExistingImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('nameAr', formData.nameAr)
      formDataToSend.append('nameEn', formData.nameEn)
      formDataToSend.append('icon', formData.icon || '')
      
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      } else if (existingImage && !formData.image) {
        // Keep existing image if no new image is uploaded
        formDataToSend.append('existingImage', existingImage)
      }

      if (isEditMode) {
        const response = await api.put(`/categories/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.data.success) {
          toast.success(t('categories.categoryUpdated'))
          navigate('/categories')
        }
      } else {
        const response = await api.post('/categories', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.data.success) {
          toast.success(t('categories.categoryCreated'))
          navigate('/categories')
        }
      }
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update category' : 'Failed to create category')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoading />

  return (
    <div className="page-shell">
      <PageHeader
        title={isEditMode ? t('categories.editCategory') : t('categories.addCategory')}
        subtitle={isEditMode ? 'Edit category information' : 'Create a new product category'}
        breadcrumbs={[
          { label: t('sidebar.categories'), href: '/categories' },
          { label: isEditMode ? t('categories.editCategory') : t('categories.addCategory') },
        ]}
      />

      <form onSubmit={handleSubmit} className="card p-6 lg:p-8 max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiLayers size={18} className="text-brand-600" />
                {t('categories.arabicName')} *
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
                className="input-field"
                placeholder="اسم الفئة"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiLayers size={18} className="text-brand-600" />
                {t('categories.englishName')} *
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
                className="input-field"
                placeholder="Category Name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiImage size={18} className="text-brand-600" />
                Icon
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="input-field"
                placeholder={t('categories.iconPlaceholder')}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUpload size={18} className="text-brand-600" />
                {t('categories.image')}
              </label>
              <div className="space-y-4">
                {(preview || existingImage) && (
                  <div className="relative inline-block">
                    <img
                      src={preview || existingImage}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 border border-dashed border-gray-300">
                  <FiUpload size={20} />
                  <span className="font-medium">
                    {existingImage ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

        <FormActions
          onCancel={() => navigate('/categories')}
          submitLabel={isEditMode ? t('common.update') : t('common.create')}
          loading={saving}
          loadingLabel={isEditMode ? 'Updating...' : 'Creating...'}
        />
      </form>
    </div>
  )
}

export default CategoryCreate


