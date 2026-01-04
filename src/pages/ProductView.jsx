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
        <div className="text-center py-12 glass-card rounded-2xl backdrop-blur-xl bg-white/70">
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
              className="p-2.5 rounded-xl glass-card hover:bg-white/50 transition-all duration-300 backdrop-blur-xl"
            >
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{product.nameEn}</h1>
              <p className="text-gray-600 mt-1 text-lg">{product.nameAr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!product.isApproved && (
              <>
                <button
                  onClick={() => approveProduct(true)}
                  className="flex items-center gap-2 px-4 py-2.5 glass-card text-white rounded-xl hover:bg-white/40 transition-all duration-300 shadow-lg backdrop-blur-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  <FiCheck size={18} />
                  Approve
                </button>
                <button
                  onClick={() => approveProduct(false)}
                  className="flex items-center gap-2 px-4 py-2.5 glass-card text-white rounded-xl hover:bg-white/40 transition-all duration-300 shadow-lg backdrop-blur-xl font-semibold bg-gradient-to-r from-red-500 to-rose-600"
                >
                  <FiX size={18} />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => navigate(`/products/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2.5 glass-card text-white rounded-xl hover:bg-white/40 transition-all duration-300 shadow-lg backdrop-blur-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600"
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
              <div className="glass-card rounded-2xl shadow-xl border border-white/40 p-6 backdrop-blur-xl bg-white/70">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
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
            <div className="glass-card rounded-2xl shadow-xl border border-white/40 p-6 backdrop-blur-xl bg-white/70">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Descriptions</h2>
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
              <div className="glass-card rounded-2xl shadow-xl border border-white/40 p-6 backdrop-blur-xl bg-white/70">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h2>
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
            <div className="glass-card rounded-2xl shadow-xl border border-white/40 p-6 backdrop-blur-xl bg-white/70">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Information</h2>
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

