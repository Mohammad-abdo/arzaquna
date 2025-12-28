import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchMessages()
  }, [page])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/messages', { params: { page, limit: 20 } })
      if (response.data.success) {
        setMessages(response.data.data.messages)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        From: {message.sender.fullName} ({message.sender.role})
                      </p>
                      <p className="text-sm text-gray-600">
                        To: {message.receiver.fullName} ({message.receiver.role})
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {message.type}
                    </span>
                  </div>
                  {message.subject && (
                    <p className="font-medium mb-2">{message.subject}</p>
                  )}
                  <p className="text-gray-700">{message.contentEn}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
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
    </div>
  )
}

export default Messages



