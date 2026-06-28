import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiShoppingBag, FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiCheckCircle, FiLock } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import PageLoading from '../components/PageLoading'
import Badge from '../components/Badge'
import DetailField from '../components/DetailField'

const VendorView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState(null)

  useEffect(() => { fetchVendor() }, [id])

  const fetchVendor = async () => {
    try {
      const response = await api.get(`/vendors/${id}`)
      if (response.data.success) setVendor(response.data.data)
    } catch {
      toast.error('Failed to load vendor')
      navigate('/vendors')
    } finally {
      setLoading(false)
    }
  }

  const toggleVendorStatus = async () => {
    try {
      const response = await api.put(`/vendors/${vendor.id}/status`, { isApproved: !vendor.isApproved })
      if (response.data.success) {
        toast.success(!vendor.isApproved ? t('vendors.vendorApproved') : 'Vendor suspended')
        fetchVendor()
      }
    } catch {
      toast.error('Failed to update vendor status')
    }
  }

  if (loading) return <PageLoading />
  if (!vendor) {
    return (
      <div className="page-shell">
        <div className="card p-12 text-center text-slate-500">Vendor not found</div>
      </div>
    )
  }

  const categories = vendor.categories?.map((vc) => vc.category) || []

  return (
    <div className="page-shell">
      <PageHeader
        title={vendor.storeName}
        subtitle={vendor.user?.fullName || 'N/A'}
        breadcrumbs={[{ label: t('sidebar.vendors'), href: '/vendors' }, { label: vendor.storeName }]}
        actions={
          <button onClick={toggleVendorStatus} className={vendor.isApproved ? 'btn-secondary' : 'btn-primary'}>
            {vendor.isApproved ? <FiLock size={16} /> : <FiCheckCircle size={16} />}
            {vendor.isApproved ? 'Suspend' : 'Approve'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <FiShoppingBag size={16} className="text-brand-600" /> Store Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailField label="Store Name" value={vendor.storeName} icon={FiShoppingBag} />
              <DetailField label="Owner" value={vendor.user?.fullName} icon={FiUser} />
              <DetailField label="City" value={vendor.city} icon={FiMapPin} />
              <DetailField label="Region" value={vendor.region} icon={FiMapPin} />
              <DetailField label="WhatsApp" value={vendor.whatsappNumber} icon={FiPhone} />
              <DetailField label="Call Number" value={vendor.callNumber} icon={FiPhone} />
              <DetailField label="Experience" value={`${vendor.yearsOfExperience} ${t('vendors.years')}`} icon={FiPackage} />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="card p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FiPackage size={16} className="text-brand-600" /> {t('vendors.specialization')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="neutral">{category.nameEn}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Owner Information</h3>
            <div className="space-y-4">
              <DetailField label="Full Name" value={vendor.user?.fullName} icon={FiUser} />
              <DetailField label="Email" value={vendor.user?.email} icon={FiMail} />
              <DetailField label="Phone" value={vendor.user?.phone} icon={FiPhone} />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
            <div className="space-y-4">
              <DetailField label="Vendor Status">
                <Badge variant={vendor.isApproved ? 'success' : 'warning'} dot>
                  {vendor.isApproved ? t('common.approved') : t('common.pending')}
                </Badge>
              </DetailField>
              <DetailField label="Products Count" icon={FiPackage}>
                <span className="text-xl font-bold text-slate-900">{vendor._count?.products || 0}</span>
              </DetailField>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorView
