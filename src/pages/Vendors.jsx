import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiSearch, FiShoppingBag, FiUser, FiMapPin, FiPackage, FiCheckCircle, FiXCircle, FiLock } from 'react-icons/fi'
import DataTable from '../components/DataTable'

const Vendors = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVendors()
  }, [page, search])

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
    } catch (error) {
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (vendor) => {
    navigate(`/vendors/${vendor.id}`)
  }

  const handleApprove = async (vendor) => {
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, {
        isApproved: true
      })
      if (response.data.success) {
        toast.success(t('vendors.vendorApproved'))
        fetchVendors()
      }
    } catch (error) {
      toast.error('Failed to approve vendor')
    }
  }

  const handleReject = async (vendor) => {
    if (!window.confirm(`Reject ${vendor.storeName}?`)) return
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, {
        isApproved: false
      })
      if (response.data.success) {
        toast.success('Vendor rejected')
        fetchVendors()
      }
    } catch (error) {
      toast.error('Failed to reject vendor')
    }
  }

  const handleBlock = async (vendor) => {
    if (!window.confirm(`Block ${vendor.storeName}?`)) return
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, {
        isApproved: false
      })
      if (response.data.success) {
        toast.success('Vendor blocked successfully')
        fetchVendors()
      }
    } catch (error) {
      toast.error('Failed to block vendor')
    }
  }

  const columns = [
    {
      header: t('vendors.storeName'),
      accessor: 'storeName',
      icon: FiShoppingBag,
      render: (vendor) => (
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md mr-3">
            <FiShoppingBag size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{vendor.storeName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <FiUser size={12} />
              {vendor.user?.fullName || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('vendors.location'),
      accessor: 'city',
      icon: FiMapPin,
      render: (vendor) => (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FiMapPin size={16} className="text-gray-400" />
          <div>
            <div className="font-medium">{vendor.city}</div>
            <div className="text-xs text-gray-500">{vendor.region}</div>
          </div>
        </div>
      )
    },
    {
      header: t('vendors.products'),
      accessor: '_count',
      icon: FiPackage,
      render: (vendor) => (
        <div className="flex items-center gap-2">
          <FiPackage size={18} className="text-primary-600" />
          <span className="text-sm font-bold text-gray-900">
            {vendor._count?.products || 0}
          </span>
        </div>
      )
    },
    {
      header: t('common.status'),
      accessor: 'isApproved',
      render: (vendor) => (
        <span
          className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
            vendor.isApproved
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
              : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300'
          }`}
        >
          {vendor.isApproved ? t('common.approved') : t('common.pending')}
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
            <h1 className="text-4xl font-bold text-gray-800">{t('vendors.title')}</h1>
            <p className="text-gray-600 mt-1">{t('vendors.subtitle')}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('vendors.searchVendors')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            />
          </div>
        </div>
      </motion.div>

      <DataTable
        columns={columns}
        data={vendors}
        loading={loading}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        onBlock={handleBlock}
        pagination={{ page, pages: totalPages }}
        onPageChange={setPage}
        actions={true}
        emptyMessage={t('vendors.noVendors')}
      />
    </div>
  )
}

export default Vendors
