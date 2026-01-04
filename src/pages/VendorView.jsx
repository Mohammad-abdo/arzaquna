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
      <div className="p-8 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-600"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <p className="text-gray-600">Vendor not found</p>
        </div>
      </div>
    )
  }

  // Get categories from the categories relation instead of specialization
  const categories = vendor.categories?.map(vc => vc.category) || []

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/vendors')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center text-white">
                <FiShoppingBag size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">{vendor.storeName}</h1>
                <p className="text-gray-600 mt-1">{vendor.user?.fullName || 'N/A'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={toggleVendorStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-150 ${
              vendor.isApproved
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            {vendor.isApproved ? <FiLock size={18} /> : <FiCheckCircle size={18} />}
            {vendor.isApproved ? 'Suspend' : 'Approve'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiShoppingBag className="text-gray-600" size={20} />
                Store Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiShoppingBag size={16} />
                    Store Name
                  </label>
                  <p className="text-base font-semibold text-gray-900 mt-1">{vendor.storeName}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiUser size={16} />
                    Owner
                  </label>
                  <p className="text-base font-semibold text-gray-900 mt-1">{vendor.user?.fullName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiMapPin size={16} />
                    City
                  </label>
                  <p className="text-base text-gray-700 mt-1">{vendor.city}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiMapPin size={16} />
                    Region
                  </label>
                  <p className="text-base text-gray-700 mt-1">{vendor.region}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiPhone size={16} />
                    WhatsApp
                  </label>
                  <p className="text-base text-gray-700 mt-1">{vendor.whatsappNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiPhone size={16} />
                    Call Number
                  </label>
                  <p className="text-base text-gray-700 mt-1">{vendor.callNumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FiPackage size={16} />
                    Experience
                  </label>
                  <p className="text-base text-gray-700 mt-1">{vendor.yearsOfExperience} {t('vendors.years')}</p>
                </div>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiPackage className="text-gray-600" size={20} />
                  {t('vendors.specialization')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200"
                    >
                      {category.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Owner Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                    <FiUser size={16} />
                    Full Name
                  </label>
                  <p className="text-gray-700">{vendor.user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                    <FiMail size={16} />
                    Email
                  </label>
                  <p className="text-gray-700">{vendor.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                    <FiPhone size={16} />
                    Phone
                  </label>
                  <p className="text-gray-700">{vendor.user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor Status</label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-md ${
                        vendor.isApproved
                          ? 'bg-gray-100 text-gray-700 border border-gray-300'
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {vendor.isApproved ? t('common.approved') : t('common.pending')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Products Count</label>
                  <div className="mt-2 flex items-center gap-2">
                    <FiPackage size={18} className="text-gray-600" />
                    <span className="text-xl font-semibold text-gray-900">{vendor._count?.products || 0}</span>
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

