import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'

const Statuses = () => {
  const [statuses, setStatuses] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)
  const [formData, setFormData] = useState({
    vendorId: '',
    productId: '',
    price: '',
    icon: '',
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    image: null
  })

  useEffect(() => {
    fetchStatuses()
    fetchVendors()
  }, [page])

  const fetchStatuses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/statuses', { params: { page, limit: 10 } })
      if (response.data.success) {
        setStatuses(response.data.data.statuses)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load statuses')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors', { params: { limit: 100 } })
      if (response.data.success) {
        setVendors(response.data.data.vendors)
      }
    } catch (error) {
      console.error('Failed to load vendors')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('vendorId', formData.vendorId)
      formDataToSend.append('productId', formData.productId || '')
      formDataToSend.append('price', formData.price)
      formDataToSend.append('icon', formData.icon || '')
      formDataToSend.append('titleAr', formData.titleAr || '')
      formDataToSend.append('titleEn', formData.titleEn || '')
      formDataToSend.append('descriptionAr', formData.descriptionAr || '')
      formDataToSend.append('descriptionEn', formData.descriptionEn || '')
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      if (editingStatus) {
        await api.put(`/statuses/${editingStatus.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Status updated successfully')
      } else {
        // Use admin endpoint for admins
        await api.post('/admin/statuses', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Status created successfully')
      }

      setShowModal(false)
      setEditingStatus(null)
      setFormData({
        vendorId: '',
        productId: '',
        price: '',
        icon: '',
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        image: null
      })
      fetchStatuses()
    } catch (error) {
      toast.error('Failed to save status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return

    try {
      await api.delete(`/statuses/${id}`)
      toast.success('Status deleted successfully')
      fetchStatuses()
    } catch (error) {
      toast.error('Failed to delete status')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Statuses & Offers</h1>
        <button
          onClick={() => {
            setEditingStatus(null)
            setFormData({
              vendorId: '',
              productId: '',
              price: '',
              icon: '',
              titleAr: '',
              titleEn: '',
              descriptionAr: '',
              descriptionEn: '',
              image: null
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiPlus /> Add Status/Offer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statuses.map((status) => (
                    <tr key={status.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {status.image && (
                          <img src={getImageUrl(status.image)} alt={status.titleEn} className="w-16 h-16 object-cover rounded" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">{status.vendor?.user?.fullName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">${status.price}</td>
                      <td className="px-6 py-4 text-sm">{status.titleEn || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(status.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingStatus ? 'Edit Status/Offer' : 'Add Status/Offer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vendor *</label>
                <select
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.storeName} - {vendor.user.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Arabic Title</label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">English Title</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  required={!editingStatus}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingStatus(null)
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingStatus ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Statuses


