import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { getImageUrls } from '../utils/imageHelper'

const ProductView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      if (response.data.success) {
        setProduct(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load product')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const approveProduct = async (isApproved) => {
    try {
      const response = await api.put(`/products/${id}/approve`, { isApproved })
      if (response.data.success) {
        toast.success(isApproved ? t('products.productApproved') : t('products.productRejected'))
        fetchProduct()
      }
    } catch (error) {
      toast.error(t('products.updateError'))
    }
  }

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-8 min-h-screen relative">
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    )
  }

  const images = getImageUrls(product.images)

  return (
    <div className="p-8 min-h-screen relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{product.nameEn}</h1>
              <p className="text-gray-600 mt-1 text-lg">{product.nameAr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!product.isApproved && (
              <>
                <button
                  onClick={() => approveProduct(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-150 font-medium"
                >
                  <FiCheck size={18} />
                  Approve
                </button>
                <button
                  onClick={() => approveProduct(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium"
                >
                  <FiX size={18} />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => navigate(`/products/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150 font-medium"
            >
              <FiEdit size={18} />
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {images.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.nameEn} ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Descriptions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Descriptions</h2>
              <div className="space-y-4">
                {product.descriptionEn && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">English Description</h3>
                    <p className="text-gray-800">{product.descriptionEn}</p>
                  </div>
                )}
                {product.descriptionAr && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Arabic Description</h3>
                    <p className="text-gray-800">{product.descriptionAr}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex items-start gap-4 pb-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{spec.key}</h3>
                        <div className="mt-1 space-y-1">
                          {spec.valueEn && (
                            <p className="text-sm text-gray-600">EN: {spec.valueEn}</p>
                          )}
                          {spec.valueAr && (
                            <p className="text-sm text-gray-600">AR: {spec.valueAr}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {product.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Price</label>
                  <p className="text-2xl font-bold text-gray-800 mt-1">${product.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-800 mt-1">{product.category?.nameEn || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor</label>
                  <p className="text-gray-800 mt-1">{product.vendor?.user?.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-500 mt-1">{product.vendor?.storeName || ''}</p>
                </div>
                {product.age && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-gray-800 mt-1">{product.age}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight</label>
                    <p className="text-gray-800 mt-1">{product.weight}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                  <p className="text-gray-800 mt-1">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {product.approvedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Approved At</label>
                    <p className="text-gray-800 mt-1">
                      {new Date(product.approvedAt).toLocaleDateString()}
                    </p>
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

export default ProductView

