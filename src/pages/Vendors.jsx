import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiSearch, FiShoppingBag, FiUser, FiMapPin, FiPackage } from 'react-icons/fi'
import DataTable from '../components/DataTable'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'

const Vendors = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchVendors() }, [page, search])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (search) params.search = search
      const response = await api.get('/vendors', { params })
      if (response.data.success) {
        setVendors(response.data.data.vendors)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch {
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendor) => {
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, { isApproved: true })
      if (response.data.success) {
        toast.success(t('vendors.vendorApproved'))
        fetchVendors()
      }
    } catch {
      toast.error('Failed to approve vendor')
    }
  }

  const handleReject = async (vendor) => {
    if (!window.confirm(`Reject ${vendor.storeName}?`)) return
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, { isApproved: false })
      if (response.data.success) {
        toast.success('Vendor rejected')
        fetchVendors()
      }
    } catch {
      toast.error('Failed to reject vendor')
    }
  }

  const handleBlock = async (vendor) => {
    if (!window.confirm(`Block ${vendor.storeName}?`)) return
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, { isApproved: false })
      if (response.data.success) {
        toast.success('Vendor blocked successfully')
        fetchVendors()
      }
    } catch {
      toast.error('Failed to block vendor')
    }
  }

  const columns = [
    {
      header: t('vendors.storeName'),
      accessor: 'storeName',
      icon: FiShoppingBag,
      render: (vendor) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white">
            <FiShoppingBag size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{vendor.storeName}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <FiUser size={11} /> {vendor.user?.fullName || 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t('vendors.location'),
      accessor: 'city',
      icon: FiMapPin,
      render: (vendor) => (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <FiMapPin size={14} className="text-slate-400" />
          <div>
            <div className="font-medium">{vendor.city}</div>
            <div className="text-xs text-slate-500">{vendor.region}</div>
          </div>
        </div>
      ),
    },
    {
      header: t('vendors.products'),
      accessor: '_count',
      icon: FiPackage,
      render: (vendor) => (
        <div className="flex items-center gap-2">
          <FiPackage size={16} className="text-brand-600" />
          <span className="text-sm font-bold text-slate-900">{vendor._count?.products || 0}</span>
        </div>
      ),
    },
    {
      header: t('common.status'),
      accessor: 'isApproved',
      render: (vendor) => (
        <Badge variant={vendor.isApproved ? 'success' : 'warning'} dot>
          {vendor.isApproved ? t('common.approved') : t('common.pending')}
        </Badge>
      ),
    },
  ]

  return (
    <div className="page-shell">
      <PageHeader
        title={t('vendors.title')}
        subtitle={t('vendors.subtitle')}
        breadcrumbs={[{ label: t('vendors.title') }]}
      />

      <div className="card p-4 mb-5">
        <div className="relative max-w-lg">
          <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder={t('vendors.searchVendors')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-field ps-10"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={vendors}
        loading={loading}
        onView={(v) => navigate(`/vendors/${v.id}`)}
        onApprove={handleApprove}
        onReject={handleReject}
        onBlock={handleBlock}
        pagination={{ page, pages: totalPages }}
        onPageChange={setPage}
        emptyMessage={t('vendors.noVendors')}
      />
    </div>
  )
}

export default Vendors
