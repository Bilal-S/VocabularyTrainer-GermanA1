import React from 'react'

const SpeechIcon = ({ 
  size = 'medium', 
  isPlaying = false, 
  disabled = false, 
  onClick, 
  title = 'Hear pronunciation',
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
    : isPlaying 
      ? '#EF4444' // red-500
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
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
      {isPlaying ? (
        // Animated speaker with sound waves
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          {/* Animated sound waves */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12h.01" className="animate-pulse" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12h.01" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h.01" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
        </svg>
      ) : (
        // Static speaker
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  )
}

export default SpeechIcon