import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi'
import { getImageUrls } from '../utils/imageHelper'

const ProductEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [specifications, setSpecifications] = useState([])
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    categoryId: '',
    vendorId: '',
    age: '',
    weight: '',
    descriptionAr: '',
    descriptionEn: '',
    price: '',
    rating: '',
    isBestProduct: false
  })

  useEffect(() => {
    fetchProduct()
    fetchCategories()
    fetchVendors()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      if (response.data.success) {
        const product = response.data.data
        setFormData({
          nameAr: product.nameAr || '',
          nameEn: product.nameEn || '',
          categoryId: product.categoryId || '',
          vendorId: product.vendorId || '',
          age: product.age || '',
          weight: product.weight || '',
          descriptionAr: product.descriptionAr || '',
          descriptionEn: product.descriptionEn || '',
          price: product.price || '',
          rating: product.rating || '',
          isBestProduct: product.isBestProduct || false
        })
        const imageUrls = getImageUrls(product.images)
        setExistingImages(imageUrls)
        setSpecifications(product.specifications || [])
      }
    } catch (error) {
      toast.error('Failed to load product')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors')
      if (response.data.success) {
        setVendors(response.data.data.vendors || [])
      }
    } catch (error) {
      toast.error('Failed to load vendors')
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + newImages.length + existingImages.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setNewImages([...newImages, ...files])
  }

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', valueAr: '', valueEn: '' }])
  }

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('nameAr', formData.nameAr)
      formDataToSend.append('nameEn', formData.nameEn)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('price', formData.price)
      if (formData.age) formDataToSend.append('age', formData.age)
      if (formData.weight) formDataToSend.append('weight', formData.weight)
      if (formData.descriptionAr) formDataToSend.append('descriptionAr', formData.descriptionAr)
      if (formData.descriptionEn) formDataToSend.append('descriptionEn', formData.descriptionEn)
      if (formData.rating) formDataToSend.append('rating', formData.rating)
      formDataToSend.append('isBestProduct', formData.isBestProduct)

      newImages.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const validSpecs = specifications.filter(spec => spec.key && (spec.valueAr || spec.valueEn))
      if (validSpecs.length > 0) {
        formDataToSend.append('specifications', JSON.stringify(validSpecs))
      }

      // Use admin endpoint for admins
      const endpoint = `/admin/products/${id}`
      const response = await api.put(endpoint, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        toast.success(t('products.productUpdated'))
        navigate('/products')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('products.productUpdated'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/products')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arabic Name *</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English Name *</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameEn} - {cat.nameAr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBestProduct"
                checked={formData.isBestProduct}
                onChange={(e) => setFormData({ ...formData, isBestProduct: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isBestProduct" className="ml-2 text-sm font-medium text-gray-700">
                Best Product (أفضل منتج)
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Arabic Description</label>
            <textarea
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">English Description</label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 10)</label>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <FiUpload size={20} />
              Upload New Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Specifications</label>
              <button
                type="button"
                onClick={addSpecification}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Specification
              </button>
            </div>
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Key"
                  value={spec.key || ''}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Value (AR)"
                  value={spec.valueAr || ''}
                  onChange={(e) => updateSpecification(index, 'valueAr', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Value (EN)"
                    value={spec.valueEn || ''}
                    onChange={(e) => updateSpecification(index, 'valueEn', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ProductEdit

