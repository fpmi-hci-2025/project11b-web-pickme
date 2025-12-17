import { forwardRef } from 'react'

const Select = forwardRef(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-body2 text-text-primary mb-1 font-medium">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`input ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
