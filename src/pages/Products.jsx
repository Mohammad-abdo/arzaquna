import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiPlus, FiEye, FiEdit } from 'react-icons/fi'
import DataTable from '../components/DataTable'

const Products = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [page, filter, search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      
      if (filter === 'pending') {
        const response = await api.get('/admin/products/pending', { params })
        if (response.data.success) {
          setProducts(response.data.data.products)
          setTotalPages(response.data.data.pagination.pages)
        }
      } else {
        params.isApproved = filter === 'approved'
        if (search) params.search = search
        const response = await api.get('/products', { params })
        if (response.data.success) {
          setProducts(response.data.data.products)
          setTotalPages(response.data.data.pagination.pages)
        }
      }
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const approveProduct = async (product, isApproved) => {
    try {
      const response = await api.put(`/products/${product.id}/approve`, { isApproved })
      if (response.data.success) {
        toast.success(`Product ${isApproved ? 'approved' : 'rejected'}`)
        fetchProducts()
      }
    } catch (error) {
      toast.error('Failed to update product')
    }
  }

  const handleView = (product) => {
    navigate(`/products/${product.id}`)
  }

  const handleEdit = (product) => {
    navigate(`/products/${product.id}/edit`)
  }

  const columns = [
    {
      header: t('products.product'),
      accessor: 'nameEn',
      render: (product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{product.nameEn}</div>
          <div className="text-sm text-gray-500">{product.nameAr}</div>
        </div>
      )
    },
    {
      header: t('products.vendor'),
      accessor: 'vendor',
      render: (product) => (
        <div className="text-sm text-gray-900">{product.vendor?.user?.fullName || 'N/A'}</div>
      )
    },
    {
      header: t('products.category'),
      accessor: 'category',
      render: (product) => (
        <div className="text-sm text-gray-900">{product.category?.nameEn || 'N/A'}</div>
      )
    },
    {
      header: t('products.price'),
      accessor: 'price',
      render: (product) => (
        <div className="text-sm font-semibold text-gray-900">${product.price}</div>
      )
    },
    {
      header: t('common.status'),
      accessor: 'isApproved',
      render: (product) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.isApproved
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {product.isApproved ? t('common.approved') : t('common.pending')}
        </span>
      )
    }
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{t('products.title')}</h1>
            <p className="text-gray-600 mt-1">{t('products.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/products/create')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <FiPlus /> {t('common.create')} {t('products.product')}
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilter('pending')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('common.pending')}
            </button>
            <button
              onClick={() => {
                setFilter('approved')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('common.approved')}
            </button>
            <button
              onClick={() => {
                setFilter('all')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
          </div>
          {filter !== 'pending' && (
            <input
              type="text"
              placeholder={t('products.searchProducts')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          )}
        </div>
      </motion.div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        pagination={{ page, pages: totalPages }}
        onPageChange={setPage}
        actions={true}
        emptyMessage={t('products.noProducts')}
      />
    </div>
  )
}

export default Products
