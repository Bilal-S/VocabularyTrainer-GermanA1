import React from 'react'

const TranslationIcon = ({ 
  size = 'medium', 
  disabled = false, 
  onClick, 
  title = 'Show translation',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  const baseClasses = `
    inline-flex items-center justify-center 
    transition-all duration-200 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
    ${sizeClasses[size] || sizeClasses.medium}
    ${className}
  `

  const iconColor = disabled 
    ? '#9CA3AF' // gray-400
    : '#3B82F6' // blue-500

  if (disabled) {
    return (
      <span 
        className={baseClasses}
        title={title}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      title={title}
      aria-label={title}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={iconColor} />
        <rect x="10" y="9" width="4" height="3" fill="white" />
        <circle cx="12" cy="6" r="1.5" fill="white" />
      </svg>
    </button>
  )
}

export default TranslationIcon