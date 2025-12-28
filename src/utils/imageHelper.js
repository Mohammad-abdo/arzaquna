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
  
  // Use relative path - vite.config.js proxies /uploads to backend
  // This allows images to be served through the Vite dev server proxy
  // Ensure path starts with /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  
  // Return relative path (will be proxied by Vite)
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

