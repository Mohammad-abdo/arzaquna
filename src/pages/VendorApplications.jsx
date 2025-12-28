import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiEye } from 'react-icons/fi'

const VendorApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedApp, setSelectedApp] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [page])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/vendors/applications', {
        params: { page, limit: 10, status: 'PENDING' }
      })
      if (response.data.success) {
        setApplications(response.data.data.applications)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const reviewApplication = async (id, status) => {
    try {
      const data = { status }
      if (status === 'REJECTED' && rejectionReason) {
        data.rejectionReason = rejectionReason
      }

      const response = await api.put(`/vendors/applications/${id}/review`, data)
      if (response.data.success) {
        toast.success(`Application ${status.toLowerCase()}`)
        setShowModal(false)
        setSelectedApp(null)
        setRejectionReason('')
        fetchApplications()
      }
    } catch (error) {
      toast.error('Failed to review application')
    }
  }

  const openReviewModal = (app, status) => {
    setSelectedApp(app)
    if (status === 'REJECTED') {
      setShowModal(true)
    } else {
      reviewApplication(app.id, status)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vendor Applications</h1>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{app.storeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{app.user.fullName}</div>
                        <div className="text-gray-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{app.city}, {app.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{app.yearsOfExperience} years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => reviewApplication(app.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FiCheck size={20} />
                          </button>
                          <button
                            onClick={() => openReviewModal(app, 'REJECTED')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiX size={20} />
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

      {/* Rejection Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Reject Application</h2>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              rows="4"
              placeholder="Rejection reason..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedApp(null)
                  setRejectionReason('')
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => reviewApplication(selectedApp.id, 'REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorApplications



