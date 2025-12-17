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
      src={src || '/default-avatar.svg'}
      alt={alt}
      className={`avatar ${sizes[size]} ${className}`}
      onError={(e) => {
        e.target.src = '/default-avatar.svg'
      }}
    />
  )
}
