// ImageUtils.js - Create this file in your frontend src/utils folder

/**
 * Helper function to convert relative image URLs to absolute URLs
 * @param {string} url - The relative or absolute URL
 * @returns {string|null} - The absolute URL or null if input is falsy
 */
export const getAbsoluteImageUrl = (url) => {
  // Return null if URL is not provided
  if (!url) return null;
  
  // If URL is already absolute (starts with http), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the backend base URL
  // Use environment variable if available, or hardcoded URL
  const backendBaseUrl = process.env.REACT_APP_API_URL || 'https://major-project01-1ukh.onrender.com';
  
  // Make sure URL starts with a slash
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${backendBaseUrl}${normalizedUrl}`;
};

/**
 * Image component with error handling
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL (relative or absolute)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS class names
 * @returns {JSX.Element} - React component
 */
export const Image = ({ src, alt = "", className = "", style = {}, ...rest }) => {
  // Get the absolute URL
  const imageUrl = getAbsoluteImageUrl(src);
  
  // Fallback image URL (you can customize this)
  const fallbackImageUrl = "/placeholder-image.jpg";
  
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        console.warn(`Failed to load image: ${src}`);
        e.target.src = fallbackImageUrl;
        e.target.onerror = null; // Prevent infinite error loop
      }}
      {...rest}
    />
  );
};