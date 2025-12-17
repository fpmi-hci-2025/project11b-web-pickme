import { forwardRef } from 'react'

const TextArea = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-body2 text-text-primary mb-1 font-medium">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`input min-h-[100px] resize-none ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
})

TextArea.displayName = 'TextArea'
export default TextArea
