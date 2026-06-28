import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiUpload, FiX } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import FormActions from '../components/FormActions'

const ProductCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])
  const [images, setImages] = useState([])
  const [specifications, setSpecifications] = useState([{ key: '', valueAr: '', valueEn: '' }])
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
    fetchCategories()
    fetchVendors()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      toast.error(t('categories.loadError'))
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors')
      if (response.data.success) {
        setVendors(response.data.data.vendors || [])
      }
    } catch (error) {
      toast.error(t('vendors.loadError'))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
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
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('nameAr', formData.nameAr)
      formDataToSend.append('nameEn', formData.nameEn)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('vendorId', formData.vendorId)
      formDataToSend.append('price', formData.price)
      if (formData.age) formDataToSend.append('age', formData.age)
      if (formData.weight) formDataToSend.append('weight', formData.weight)
      if (formData.descriptionAr) formDataToSend.append('descriptionAr', formData.descriptionAr)
      if (formData.descriptionEn) formDataToSend.append('descriptionEn', formData.descriptionEn)

      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const validSpecs = specifications.filter(spec => spec.key && (spec.valueAr || spec.valueEn))
      if (validSpecs.length > 0) {
        formDataToSend.append('specifications', JSON.stringify(validSpecs))
      }

      // Use admin endpoint for admins
      const endpoint = '/admin/products'
      const response = await api.post(endpoint, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        toast.success(t('products.productCreated'))
        navigate('/products')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('products.createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Create Product"
        subtitle="Add a new product to the system"
        breadcrumbs={[{ label: t('sidebar.products'), href: '/products' }, { label: 'Create' }]}
      />

      <form onSubmit={handleSubmit} className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arabic Name *</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English Name *</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="input-field"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
              <select
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                required
                className="input-field"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.storeName} - {vendor.user?.fullName}
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
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="input-field"
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
                className="input-field"
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
              className="input-field resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">English Description</label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 10)</label>
            <div className="flex flex-wrap gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <FiUpload size={20} />
              Upload Images
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
                className="btn-primary !py-1.5 !px-3 text-sm"
              >
                Add Specification
              </button>
            </div>
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                className="input-field"
                />
                <input
                  type="text"
                  placeholder="Value (AR)"
                  value={spec.valueAr}
                  onChange={(e) => updateSpecification(index, 'valueAr', e.target.value)}
                className="input-field"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Value (EN)"
                    value={spec.valueEn}
                    onChange={(e) => updateSpecification(index, 'valueEn', e.target.value)}
                    className="flex-1 input-field"
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

          <FormActions
            onCancel={() => navigate('/products')}
            submitLabel="Create Product"
            loading={loading}
            loadingLabel="Creating..."
          />
        </form>
    </div>
  )
}

export default ProductCreate

