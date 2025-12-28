import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiShoppingBag, FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiCheckCircle, FiXCircle, FiLock } from 'react-icons/fi'

const VendorView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState(null)

  useEffect(() => {
    fetchVendor()
  }, [id])

  const fetchVendor = async () => {
    try {
      const response = await api.get(`/vendors/${id}`)
      if (response.data.success) {
        setVendor(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load vendor')
      navigate('/vendors')
    } finally {
      setLoading(false)
    }
  }

  const toggleVendorStatus = async () => {
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, {
        isApproved: !vendor.isApproved
      })
      if (response.data.success) {
        toast.success(!vendor.isApproved ? t('vendors.vendorApproved') : 'Vendor suspended')
        fetchVendor()
      }
    } catch (error) {
      toast.error('Failed to update vendor status')
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500">Vendor not found</p>
        </div>
      </div>
    )
  }

  const specialization = Array.isArray(vendor.specialization)
    ? vendor.specialization
    : typeof vendor.specialization === 'string'
    ? JSON.parse(vendor.specialization)
    : []

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/vendors')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                <FiShoppingBag size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">{vendor.storeName}</h1>
                <p className="text-gray-600 mt-1">{vendor.user?.fullName || 'N/A'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={toggleVendorStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              vendor.isApproved
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {vendor.isApproved ? <FiLock size={18} /> : <FiCheckCircle size={18} />}
            {vendor.isApproved ? 'Suspend' : 'Approve'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiShoppingBag className="text-primary-600" size={24} />
                Store Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiShoppingBag size={16} />
                    Store Name
                  </label>
                  <p className="text-lg font-bold text-gray-800">{vendor.storeName}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiUser size={16} />
                    Owner
                  </label>
                  <p className="text-lg font-bold text-gray-800">{vendor.user?.fullName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiMapPin size={16} />
                    City
                  </label>
                  <p className="text-lg font-medium text-gray-800">{vendor.city}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiMapPin size={16} />
                    Region
                  </label>
                  <p className="text-lg font-medium text-gray-800">{vendor.region}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiPhone size={16} />
                    WhatsApp
                  </label>
                  <p className="text-lg font-medium text-gray-800">{vendor.whatsappNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiPhone size={16} />
                    Call Number
                  </label>
                  <p className="text-lg font-medium text-gray-800">{vendor.callNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiPackage size={16} />
                    Experience
                  </label>
                  <p className="text-lg font-medium text-gray-800">{vendor.yearsOfExperience} {t('vendors.years')}</p>
                </div>
              </div>
            </div>

            {specialization.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiPackage className="text-primary-600" size={24} />
                  {t('vendors.specialization')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Owner Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
                    <FiUser size={16} />
                    Full Name
                  </label>
                  <p className="text-gray-800">{vendor.user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
                    <FiMail size={16} />
                    Email
                  </label>
                  <p className="text-gray-800">{vendor.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
                    <FiPhone size={16} />
                    Phone
                  </label>
                  <p className="text-gray-800">{vendor.user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Vendor Status</label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                        vendor.isApproved
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
                          : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300'
                      }`}
                    >
                      {vendor.isApproved ? t('common.approved') : t('common.pending')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Products Count</label>
                  <div className="mt-2 flex items-center gap-2">
                    <FiPackage size={20} className="text-primary-600" />
                    <span className="text-2xl font-bold text-gray-800">{vendor._count?.products || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VendorView

