import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AppContent = () => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({ contentAr: '', contentEn: '' })

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/app-content')
      if (response.data.success) {
        setContents(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (content) => {
    setEditingType(content.type)
    setFormData({
      contentAr: content.contentAr,
      contentEn: content.contentEn
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/app-content/${editingType}`, formData)
      toast.success('Content updated successfully')
      setEditingType(null)
      fetchContents()
    } catch (error) {
      toast.error('Failed to update content')
    }
  }

  const contentTypes = {
    ABOUT: 'About App',
    PRIVACY_POLICY: 'Privacy Policy',
    TERMS_CONDITIONS: 'Terms & Conditions'
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">App Content</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(contentTypes).map(([type, label]) => {
              const content = contents.find((c) => c.type === type)
              const isEditing = editingType === type

              return (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{label}</h2>
                    <button
                      onClick={() => handleEdit(content || { type, contentAr: '', contentEn: '' })}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      {content ? 'Edit' : 'Create'}
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Arabic Content</label>
                        <textarea
                          value={formData.contentAr}
                          onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                          rows="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">English Content</label>
                        <textarea
                          value={formData.contentEn}
                          onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                          rows="10"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingType(null)}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    content && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Arabic:</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">{content.contentAr}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">English:</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">{content.contentEn}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppContent



