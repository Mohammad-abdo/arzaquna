import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { getImageUrls } from '../utils/imageHelper'
import PageHeader from '../components/PageHeader'
import PageLoading from '../components/PageLoading'
import Badge from '../components/Badge'
import DetailField from '../components/DetailField'

const ProductView = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      if (response.data.success) setProduct(response.data.data)
    } catch {
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
    } catch {
      toast.error(t('products.updateError'))
    }
  }

  if (loading) return <PageLoading />
  if (!product) {
    return (
      <div className="page-shell">
        <div className="card p-12 text-center text-slate-500">Product not found</div>
      </div>
    )
  }

  const images = getImageUrls(product.images)

  return (
    <div className="page-shell">
      <PageHeader
        title={product.nameEn}
        subtitle={product.nameAr}
        breadcrumbs={[{ label: t('sidebar.products'), href: '/products' }, { label: product.nameEn }]}
        actions={
          <div className="flex items-center gap-2">
            {!product.isApproved && (
              <>
                <button onClick={() => approveProduct(true)} className="btn-primary">
                  <FiCheck size={16} /> Approve
                </button>
                <button onClick={() => approveProduct(false)} className="btn-secondary">
                  <FiX size={16} /> Reject
                </button>
              </>
            )}
            <button onClick={() => navigate(`/products/${id}/edit`)} className="btn-primary">
              <FiEdit size={16} /> {t('common.edit')}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {images.length > 0 && (
            <div className="card p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <img key={index} src={image} alt={`${product.nameEn} ${index + 1}`} className="w-full h-56 object-cover rounded-lg border border-slate-200" />
                ))}
              </div>
            </div>
          )}
          <div className="card p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Descriptions</h2>
            <div className="space-y-4">
              {product.descriptionEn && <DetailField label="English" value={product.descriptionEn} />}
              {product.descriptionAr && <DetailField label="Arabic" value={product.descriptionAr} />}
            </div>
          </div>
          {product.specifications?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="pb-3 border-b border-slate-100 last:border-0">
                    <p className="font-semibold text-slate-800 text-sm">{spec.key}</p>
                    {spec.valueEn && <p className="text-xs text-slate-500 mt-1">EN: {spec.valueEn}</p>}
                    {spec.valueAr && <p className="text-xs text-slate-500">AR: {spec.valueAr}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Product Information</h2>
          <div className="space-y-4">
            <DetailField label="Status">
              <Badge variant={product.isApproved ? 'success' : 'warning'} dot>
                {product.isApproved ? t('common.approved') : t('common.pending')}
              </Badge>
            </DetailField>
            <DetailField label="Price" value={`${Number(product.price).toLocaleString()} SAR`} />
            <DetailField label="Category" value={product.category?.nameEn} />
            <DetailField label="Vendor" value={product.vendor?.user?.fullName} />
            {product.vendor?.storeName && <p className="text-xs text-slate-500 -mt-2">{product.vendor.storeName}</p>}
            {product.age && <DetailField label="Age" value={product.age} />}
            {product.weight && <DetailField label="Weight" value={product.weight} />}
            <DetailField label="Created At" value={new Date(product.createdAt).toLocaleDateString()} />
            {product.approvedAt && <DetailField label="Approved At" value={new Date(product.approvedAt).toLocaleDateString()} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductView
