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
          <div className="text-sm font-medium text-white">{product.nameEn}</div>
          <div className="text-sm text-white/80">{product.nameAr}</div>
        </div>
      )
    },
    {
      header: t('products.vendor'),
      accessor: 'vendor',
      render: (product) => (
        <div className="text-sm text-white">{product.vendor?.user?.fullName || 'N/A'}</div>
      )
    },
    {
      header: t('products.category'),
      accessor: 'category',
      render: (product) => (
        <div className="text-sm text-white">{product.category?.nameEn || 'N/A'}</div>
      )
    },
    {
      header: t('products.price'),
      accessor: 'price',
      render: (product) => (
        <div className="text-sm font-semibold text-white">${product.price}</div>
      )
    },
    {
      header: t('common.status'),
      accessor: 'isApproved',
      render: (product) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full backdrop-blur-sm ${
            product.isApproved
              ? 'bg-green-500/30 text-green-100 border border-green-500/50'
              : 'bg-yellow-500/30 text-yellow-100 border border-yellow-500/50'
          }`}
        >
          {product.isApproved ? t('common.approved') : t('common.pending')}
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
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">{t('products.title')}</h1>
            <p className="text-white/90 mt-1 text-lg">{t('products.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/products/create')}
            className="flex items-center gap-2 px-4 py-2 glass-card text-white rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg backdrop-blur-xl font-semibold"
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
              className={`px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-xl font-semibold ${
                filter === 'pending'
                  ? 'glass-card text-white shadow-lg bg-white/30'
                  : 'glass-gradient text-gray-700 border border-white/20 hover:bg-white/20'
              }`}
            >
              {t('common.pending')}
            </button>
            <button
              onClick={() => {
                setFilter('approved')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-xl font-semibold ${
                filter === 'approved'
                  ? 'glass-card text-white shadow-lg bg-white/30'
                  : 'glass-gradient text-gray-700 border border-white/20 hover:bg-white/20'
              }`}
            >
              {t('common.approved')}
            </button>
            <button
              onClick={() => {
                setFilter('all')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-xl font-semibold ${
                filter === 'all'
                  ? 'glass-card text-white shadow-lg bg-white/30'
                  : 'glass-gradient text-gray-700 border border-white/20 hover:bg-white/20'
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
              className="flex-1 max-w-md px-4 py-2 glass-card border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/40 backdrop-blur-xl text-white placeholder:text-white/70"
            />
          )}
        </div>
      </motion.div>

      <div className="relative z-10">
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
    </div>
  )
}

export default Products
