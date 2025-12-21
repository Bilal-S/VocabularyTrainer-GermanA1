/**
 * Utility functions for processing text content for speech synthesis
 */

/**
 * Detects blank spaces in fill-in-the-blank exercises
 * @param {string} text - Text to analyze
 * @returns {Array} Array of blank space positions
 */
export const detectBlankSpaces = (text) => {
  const blanks = []
  const blankPattern = /___+/g
  let match
  
  while ((match = blankPattern.exec(text)) !== null) {
    blanks.push({
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      length: match[0].length
    })
  }
  
  return blanks
}

/**
 * Processes text for speech synthesis, handling blanks
 * @param {string} text - Text to process
 * @returns {Object} Processed text with metadata
 */
export const processTextForSpeech = (text) => {
  const blankSpaces = detectBlankSpaces(text)
  
  return {
    originalText: text,
    blankSpaces,
    hasBlanks: blankSpaces.length > 0
  }
}

/**
 * Checks if browser supports speech synthesis
 * @returns {boolean} True if supported
 */
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window
}

/**
 * Detects if the device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * Detects if the device is Android
 * @returns {boolean} True if Android device
 */
export const isAndroidDevice = () => {
  return /Android/i.test(navigator.userAgent)
}

/**
 * Detects if the device is iOS
 * @returns {boolean} True if iOS device
 */
export const isIOSDevice = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * Gets browser-specific speech synthesis settings for German
 * @returns {Object} Browser-specific settings
 */
export const getGermanBrowserSpecificSettings = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = isMobileDevice()
  const isAndroid = isAndroidDevice()
  const isIOS = isIOSDevice()
  
  // Mobile Chrome (Android)
  if (isAndroid && userAgent.includes('chrome')) {
    return {
      preferredVoiceOrder: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
      defaultRate: 0.85, // Slightly slower for German clarity
      voiceLoadDelay: 1500, // Longer delay for Android
      usePolling: true,
      maxPollingAttempts: 15,
      pollingInterval: 200
    }
  }
  
  // iOS Safari
  if (isIOS && userAgent.includes('safari')) {
    return {
      preferredVoiceOrder: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de'],
      defaultRate: 0.8, // Even slower for iOS German
      voiceLoadDelay: 2000, // Even longer for iOS
      usePolling: true,
      maxPollingAttempts: 20,
      pollingInterval: 200
    }
  }
  
  // Desktop Chrome
  if (userAgent.includes('chrome')) {
    return {
      preferredVoiceOrder: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
      defaultRate: 0.85,
      voiceLoadDelay: 100,
      usePolling: false
    }
  }
  
  // Desktop Firefox
  if (userAgent.includes('firefox')) {
    return {
      preferredVoiceOrder: ['de-DE', 'de_DE', 'de', 'de-AT', 'de_AT'],
      defaultRate: 0.8,
      voiceLoadDelay: 500,
      usePolling: false
    }
  }
  
  // Desktop Safari
  if (userAgent.includes('safari')) {
    return {
      preferredVoiceOrder: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
      defaultRate: 0.85,
      voiceLoadDelay: 200,
      usePolling: false
    }
  }
  
  // Default settings (with mobile fallback)
  return {
    preferredVoiceOrder: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
    defaultRate: 0.85,
    voiceLoadDelay: isMobile ? 1500 : 100,
    usePolling: isMobile,
    maxPollingAttempts: 15,
    pollingInterval: 200
  }
}

/**
 * Gets browser-specific speech synthesis settings (alias for German)
 * @returns {Object} Browser-specific settings
 */
export const getBrowserSpecificSettings = () => {
  return getGermanBrowserSpecificSettings()
}

/**
 * Normalizes German text for comparison, handling umlauts and special characters
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export const normalizeGermanText = (text) => {
  if (!text) return ''
  
  // For speech synthesis, we want to keep umlauts as they are
  // But for answer validation, we might want to normalize
  return text
}

/**
 * Checks if the difference between two German texts is only umlauts/ß
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @returns {boolean} True if only difference is umlauts/ß
 */
export const isGermanAccentError = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false
  
  // Check if only difference is umlauts/ß
  const normalizedUser = userAnswer
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
  
  const normalizedCorrect = correctAnswer
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
  
  return normalizedUser.toLowerCase() === normalizedCorrect.toLowerCase() && 
         userAnswer.toLowerCase() !== correctAnswer.toLowerCase()
}

/**
 * Validates German answer with accent tolerance
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @returns {boolean} True if answer is correct (with accent tolerance)
 */
export const validateGermanAnswer = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false
  
  // Direct match first
  if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
    return true
  }
  
  // Check if it's just an accent/umlaut difference
  if (isGermanAccentError(userAnswer, correctAnswer)) {
    return true
  }
  
  return false
}

/**
 * Processes German text for speech synthesis, handling special cases
 * @param {string} text - Text to process
 * @param {Object} options - Processing options
 * @returns {Object} Processed text with speech metadata
 */
export const processGermanTextForSpeech = (text, options = {}) => {
  const processed = {
    originalText: text,
    speechText: text,
    hasBlanks: false,
    blankPositions: [],
    segments: []
  }
  
  // Detect blank spaces
  const blankSpaces = detectBlankSpaces(text)
  processed.hasBlanks = blankSpaces.length > 0
  processed.blankPositions = blankSpaces
  
  // Split text into segments for speech synthesis
  if (processed.hasBlanks) {
    const parts = text.split(/___+/)
    parts.forEach((part, index) => {
      if (part.trim()) {
        processed.segments.push({
          type: 'text',
          content: part.trim(),
          position: index
        })
      }
      
      // Add blank segment between parts (except after last part)
      if (index < parts.length - 1) {
        processed.segments.push({
          type: 'blank',
          content: '___',
          position: index
        })
      }
    })
  } else {
    processed.segments.push({
      type: 'text',
      content: text,
      position: 0
    })
  }
  
  return processed
}

/**
 * Gets German voice preference order for different regions
 * @returns {Array} Array of preferred voice language codes
 */
export const getGermanVoicePreferences = () => {
  return [
    'de-DE', // German - Germany (primary)
    'de_DE', // German - Germany (underscore format)
    'de-AT', // German - Austria
    'de_AT', // German - Austria (underscore format)
    'de-CH', // German - Switzerland
    'de_CH', // German - Switzerland (underscore format)
    'de'      // Generic German (fallback)
  ]
}

/**
 * Filters available voices to German voices only
 * @param {Array} voices - Array of available voices
 * @returns {Array} Filtered German voices
 */
export const filterGermanVoices = (voices) => {
  return voices.filter(voice => 
    voice.lang.startsWith('de-') || voice.lang.startsWith('de_')
  )
}

/**
 * Sorts German voices by preference
 * @param {Array} voices - Array of German voices
 * @returns {Array} Sorted voices by preference
 */
export const sortGermanVoicesByPreference = (voices) => {
  const preferences = getGermanVoicePreferences()
  
  return voices.sort((a, b) => {
    const aIndex = preferences.findIndex(pref => a.lang === pref)
    const bIndex = preferences.findIndex(pref => b.lang === pref)
    
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    
    return aIndex - bIndex
  })
}

/**
 * Creates a fallback visual indicator for unsupported browsers
 * @param {string} text - Text that would be spoken
 * @returns {HTMLElement} Visual indicator element
 */
export const createSpeechFallbackIndicator = (text) => {
  const indicator = document.createElement('div')
  indicator.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-xs'
  indicator.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
      <span class="text-sm">"${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"</span>
    </div>
  `
  
  return indicator
}

/**
 * Shows a temporary speech indicator and auto-removes it
 * @param {string} text - Text to display
 * @param {number} duration - Display duration in milliseconds (default: 3000)
 */
export const showTemporarySpeechIndicator = (text, duration = 3000) => {
  const indicator = createSpeechFallbackIndicator(text)
  document.body.appendChild(indicator)
  
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator)
    }
  }, duration)
}