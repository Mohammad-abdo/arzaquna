import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiX, FiUpload } from 'react-icons/fi'
import { getImageUrl } from '../utils/imageHelper'

const Sliders = () => {
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlider, setEditingSlider] = useState(null)
  const [preview, setPreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    icon: '',
    link: '',
    order: 0,
    image: null
  })

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/sliders/all')
      if (response.data.success) {
        setSliders(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load sliders')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('titleAr', formData.titleAr)
      formDataToSend.append('titleEn', formData.titleEn)
      formDataToSend.append('descriptionAr', formData.descriptionAr)
      formDataToSend.append('descriptionEn', formData.descriptionEn)
      formDataToSend.append('icon', formData.icon)
      formDataToSend.append('link', formData.link)
      formDataToSend.append('order', formData.order)
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      if (editingSlider) {
        await api.put(`/sliders/${editingSlider.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Slider updated successfully')
      } else {
        await api.post('/sliders', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Slider created successfully')
      }

      setShowModal(false)
      setEditingSlider(null)
      setPreview(null)
      setExistingImage(null)
      setFormData({
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        icon: '',
        link: '',
        order: 0,
        image: null
      })
      fetchSliders()
    } catch (error) {
      toast.error('Failed to save slider')
    }
  }

  const handleEdit = (slider) => {
    setEditingSlider(slider)
    setFormData({
      titleAr: slider.titleAr,
      titleEn: slider.titleEn,
      descriptionAr: slider.descriptionAr || '',
      descriptionEn: slider.descriptionEn || '',
      icon: slider.icon || '',
      link: slider.link || '',
      order: slider.order || 0,
      image: null
    })
    if (slider.image) {
      setExistingImage(getImageUrl(slider.image))
      setPreview(null)
    } else {
      setExistingImage(null)
      setPreview(null)
    }
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setPreview(URL.createObjectURL(file))
      setExistingImage(null) // Clear existing image when new one is selected
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setPreview(null)
    setExistingImage(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) return

    try {
      await api.delete(`/sliders/${id}`)
      toast.success('Slider deleted successfully')
      fetchSliders()
    } catch (error) {
      toast.error('Failed to delete slider')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sliders</h1>
        <button
          onClick={() => {
            setEditingSlider(null)
            setPreview(null)
            setExistingImage(null)
            setFormData({
              titleAr: '',
              titleEn: '',
              descriptionAr: '',
              descriptionEn: '',
              icon: '',
              link: '',
              order: 0,
              image: null
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiPlus /> Add Slider
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {sliders.map((slider) => (
              <div key={slider.id} className="border rounded-lg p-4 flex items-center gap-4">
                {slider.image && (
                  <img src={getImageUrl(slider.image)} alt={slider.titleEn} className="w-32 h-20 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{slider.titleEn}</h3>
                  <p className="text-gray-600 text-sm">{slider.titleAr}</p>
                  <p className="text-gray-500 text-xs mt-1">Order: {slider.order}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(slider)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingSlider ? 'Edit Slider' : 'Add Slider'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Arabic Title</label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">English Title</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Arabic Description</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">English Description</label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                {(preview || existingImage) && (
                  <div className="relative inline-block mb-4">
                    <img
                      src={preview || existingImage}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300">
                  <FiUpload size={20} />
                  <span className="font-medium">
                    {existingImage ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingSlider && !existingImage}
                    className="hidden"
                  />
                </label>
                {editingSlider && !existingImage && !preview && (
                  <p className="text-xs text-gray-500 mt-1">No image currently set. Upload a new image.</p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingSlider(null)
                    setPreview(null)
                    setExistingImage(null)
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingSlider ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sliders


