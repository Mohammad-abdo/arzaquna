/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path (e.g., /uploads/products/image.png)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Use environment variable for backend URL in production
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  // If backend URL is set, use it (production)
  if (backendUrl) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${backendUrl}${cleanPath}`
  }
  
  // In development, use relative path (Vite proxy handles it)
  // In production without env var, use relative path (Vercel rewrites handle it)
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return cleanPath
}

/**
 * Get image URLs from array (handles JSON arrays)
 * @param {any} images - Images array or JSON string
 * @returns {string[]} Array of full image URLs
 */
export const getImageUrls = (images) => {
  if (!images) return []
  
  // If it's already an array
  if (Array.isArray(images)) {
    return images.map(img => getImageUrl(img))
  }
  
  // If it's a JSON string, parse it
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      if (Array.isArray(parsed)) {
        return parsed.map(img => getImageUrl(img))
      }
    } catch (e) {
      // If parsing fails, treat as single image path
      return [getImageUrl(images)]
    }
  }
  
  return []
}

