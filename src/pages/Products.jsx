import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiSearch } from 'react-icons/fi'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import FilterTabs from '../components/FilterTabs'

const Products = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchProducts() }, [page, filter, search])

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
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: t('products.product'),
      accessor: 'nameEn',
      render: (product) => (
        <div>
          <div className="text-sm font-semibold text-slate-900">{product.nameEn}</div>
          <div className="text-xs text-slate-500">{product.nameAr}</div>
        </div>
      ),
    },
    {
      header: t('products.vendor'),
      accessor: 'vendor',
      render: (product) => <span className="text-sm text-slate-700">{product.vendor?.user?.fullName || 'N/A'}</span>,
    },
    {
      header: t('products.category'),
      accessor: 'category',
      render: (product) => <span className="text-sm text-slate-700">{product.category?.nameEn || 'N/A'}</span>,
    },
    {
      header: t('products.price'),
      accessor: 'price',
      render: (product) => (
        <span className="text-sm font-bold text-slate-900">{Number(product.price).toLocaleString()} SAR</span>
      ),
    },
    {
      header: t('common.status'),
      accessor: 'isApproved',
      render: (product) => (
        <Badge variant={product.isApproved ? 'success' : 'warning'} dot>
          {product.isApproved ? t('common.approved') : t('common.pending')}
        </Badge>
      ),
    },
  ]

  const filterTabs = [
    { label: t('common.pending'), value: 'pending' },
    { label: t('common.approved'), value: 'approved' },
    { label: 'All', value: 'all' },
  ]

  return (
    <div className="page-shell">
      <PageHeader
        title={t('products.title')}
        subtitle={t('products.subtitle')}
        breadcrumbs={[{ label: t('products.title') }]}
        actions={
          <button onClick={() => navigate('/products/create')} className="btn-primary">
            <FiPlus size={17} /> {t('common.create')} {t('products.product')}
          </button>
        }
      />

      <div className="card p-4 mb-5 space-y-3">
        <FilterTabs tabs={filterTabs} value={filter} onChange={(v) => { setFilter(v); setPage(1) }} />
        {filter !== 'pending' && (
          <div className="relative max-w-md">
            <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={t('products.searchProducts')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="input-field ps-9"
            />
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        onView={(p) => navigate(`/products/${p.id}`)}
        onEdit={(p) => navigate(`/products/${p.id}/edit`)}
        pagination={{ page, pages: totalPages }}
        onPageChange={setPage}
        emptyMessage={t('products.noProducts')}
      />
    </div>
  )
}

export default Products
