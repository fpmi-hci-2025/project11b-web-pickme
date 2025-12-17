export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    filled: 'btn-filled',
    outline: 'btn-outline',
  }

  const sizes = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  }

  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Загрузка...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
