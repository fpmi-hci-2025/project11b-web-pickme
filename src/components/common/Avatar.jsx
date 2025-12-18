const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')

function getAvatarUrl(src) {
  if (!src) return '/default-avatar.svg'
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${API_BASE_URL}${src}`
}

export default function Avatar({ src, alt, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  return (
    <img
      src={getAvatarUrl(src)}
      alt={alt}
      className={`avatar ${sizes[size]} ${className}`}
      onError={(e) => {
        e.target.src = '/default-avatar.svg'
      }}
    />
  )
}
