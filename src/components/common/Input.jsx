import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-body2 text-text-primary mb-1 font-medium">
          {label}
        </label>
      )}
      <input ref={ref} className={`input ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
