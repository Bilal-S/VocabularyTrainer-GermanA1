class SpeechSynthesisService {
  constructor() {
    this.synthesis = window.speechSynthesis
    this.isSupported = 'speechSynthesis' in window
    this.voices = []
    this.selectedVoice = null
    this.isInitialized = false
    this.dingSound = null
    this.speechQueue = []
    this.isProcessingQueue = false
    this.fallbackMode = false
  }

  initialize() {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported in this browser')
      this.fallbackMode = true
      return false
    }
    
    // Load ding sound for blank spaces
    this.loadDingSound()
    
    // Load available voices with mobile detection
    this.initializeVoices()
    
    this.isInitialized = true
    return true
  }

  initializeVoices() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    
    // Immediate attempt
    this.loadVoices()
    
    // Set up voice change listener
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        console.log('[SpeechService] Voices changed event fired')
        this.loadVoices()
      }
    }
    
    // For mobile devices, use polling mechanism
    if (isMobile) {
      console.log('[SpeechService] Mobile device detected, starting voice polling')
      this.pollForVoices(15, 200)
    }
  }

  pollForVoices(maxAttempts = 15, intervalMs = 200) {
    let attempts = 0
    
    const pollInterval = setInterval(() => {
      const voices = this.synthesis.getVoices()
      attempts++
      
      console.log(`[SpeechService] Polling attempt ${attempts}/${maxAttempts}, found ${voices.length} voices`)
      
      if (voices.length > 0) {
        console.log('[SpeechService] Voices loaded successfully via polling')
        this.loadVoices()
        clearInterval(pollInterval)
      } else if (attempts >= maxAttempts) {
        console.warn('[SpeechService] Voice polling reached max attempts, no voices found')
        clearInterval(pollInterval)
        // One final attempt
        this.loadVoices()
      }
    }, intervalMs)
  }

  loadDingSound() {
    // Create a simple ding sound using Web Audio API
    this.dingSound = {
      play: () => {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 800 // Pleasant ding frequency
          oscillator.type = 'sine'
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
        } catch (error) {
          console.warn('Could not play ding sound:', error)
        }
      }
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices()
    
    console.log('[SpeechService] Available voices:', this.voices.map(v => `${v.name} (${v.lang})`))
    
    // According to requirements: prioritize German voices with both de-DE and de_DE formats
    // Handle both de-DE and de_DE formats
    const preferredOrder = [
      ['de-DE', 'de_DE'],
      ['de-AT', 'de_AT'],
      ['de-CH', 'de_CH'],
      ['de']
    ]
    
    for (const langVariants of preferredOrder) {
      const voice = this.voices.find(v => 
        langVariants.some(lang => v.lang === lang)
      )
      if (voice) {
        console.log('[SpeechService] Selected voice:', voice.name, voice.lang)
        this.selectedVoice = voice
        break
      }
    }
    
    // Fallback to any German voice (handle both - and _ separators)
    if (!this.selectedVoice) {
      this.selectedVoice = this.voices.find(voice =>
        voice.lang.startsWith('de-') || voice.lang.startsWith('de_')
      )
      if (this.selectedVoice) {
        console.log('[SpeechService] Selected fallback German voice:', this.selectedVoice.name, this.selectedVoice.lang)
      }
    }
    
    // Final fallback to first available voice
    if (!this.selectedVoice && this.voices.length > 0) {
      this.selectedVoice = this.voices[0]
      console.log('[SpeechService] Selected first available voice:', this.selectedVoice.name, this.selectedVoice.lang)
    }
  }

  getGermanVoices() {
    // Filter voices that start with de- or de_
    return this.voices.filter(voice => 
      voice.lang.startsWith('de-') || voice.lang.startsWith('de_')
    )
  }

  setVoice(voice) {
    this.selectedVoice = voice
  }

  speak(text, options = {}) {
    if (!text) return Promise.resolve()
    
    if (!this.isSupported || this.fallbackMode) {
      // Fallback: Show text in visual indicator
      this.showFallbackIndicator(text, options)
      return Promise.resolve()
    }
    
    // Add to queue for sequential processing
    return new Promise((resolve, reject) => {
      this.speechQueue.push({
        text,
        options,
        resolve,
        reject
      })
      
      this.processQueue()
    })
  }

  showFallbackIndicator(text, options = {}) {
    // Create a temporary visual indicator for browsers without speech support
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
    
    document.body.appendChild(indicator)
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator)
      }
    }, 3000)
  }

  async processQueue() {
    if (this.isProcessingQueue || this.speechQueue.length === 0) return
    
    this.isProcessingQueue = true
    
    while (this.speechQueue.length > 0) {
      const item = this.speechQueue.shift()
      
      try {
        await this.speakInternal(item.text, item.options)
        item.resolve()
      } catch (error) {
        console.error('Speech synthesis error:', error)
        item.reject(error)
      }
    }
    
    this.isProcessingQueue = false
  }

  speakInternal(text, options = {}) {
    return new Promise((resolve) => {
      // Cancel any ongoing speech
      this.synthesis.cancel()
      
      // Process text for blank spaces
      const { segments } = this.processTextForBlanks(text)
      
      // Speak each segment sequentially
      this.speakSegments(segments, 0, resolve, options)
    })
  }

  processTextForBlanks(text) {
    // Split text by blank spaces (___)
    const segments = []
    const parts = text.split(/___+/)
    
    parts.forEach((part, index) => {
      if (part) {
        segments.push({ type: 'text', content: part.trim() })
      }
      
      // Add blank sound between parts (except after last part)
      if (index < parts.length - 1) {
        segments.push({ type: 'blank' })
      }
    })
    
    return { segments, hasBlanks: parts.length > 1 }
  }

  speakSegments(segments, index, resolve, options = {}) {
    if (index >= segments.length) {
      resolve()
      return
    }

    const segment = segments[index]
    
    if (segment.type === 'blank') {
      // Play ding sound for blank
      this.dingSound.play()
      setTimeout(() => {
        this.speakSegments(segments, index + 1, resolve, options)
      }, 200) // Brief pause after ding
    } else {
      // Speak text segment
      const utterance = new SpeechSynthesisUtterance(segment.content)
      
      // Configure voice
      utterance.voice = this.selectedVoice
      utterance.lang = this.selectedVoice?.lang || 'de-DE' || 'de_DE'
      utterance.rate = options.rate || 0.9 // Slightly slower for German clarity
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0
      
      // Event handlers
      utterance.onend = () => {
        this.speakSegments(segments, index + 1, resolve, options)
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        this.speakSegments(segments, index + 1, resolve, options) // Continue on error
      }
      
      this.synthesis.speak(utterance)
    }
  }

  stop() {
    this.synthesis.cancel()
    this.speechQueue = []
    this.isProcessingQueue = false
  }

  isSpeaking() {
    return this.synthesis.speaking
  }

  getVoices() {
    return this.voices
  }

  getCurrentVoice() {
    return this.selectedVoice
  }

  // Browser compatibility check
  getBrowserInfo() {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome')) {
      return { name: 'Chrome', speechSupport: 'full' }
    } else if (userAgent.includes('firefox')) {
      return { name: 'Firefox', speechSupport: 'partial' }
    } else if (userAgent.includes('safari')) {
      return { name: 'Safari', speechSupport: 'partial' }
    } else if (userAgent.includes('edge')) {
      return { name: 'Edge', speechSupport: 'full' }
    }
    
    return { name: 'Unknown', speechSupport: 'unknown' }
  }

  // Get fallback message for unsupported browsers
  getFallbackMessage() {
    const browserInfo = this.getBrowserInfo()
    
    switch (browserInfo.speechSupport) {
      case 'partial':
        return `Speech synthesis has limited support in ${browserInfo.name}. Some features may not work correctly.`
      case 'none':
        return `Speech synthesis is not supported in ${browserInfo.name}. Consider using a modern browser.`
      default:
        return 'Speech synthesis is not available in this browser.'
    }
  }

  // Step-specific synthesis rules for German
  shouldSynthesizeForStep(step, contentType) {
    const stepRules = {
      1: { // Review Previous Mistakes
        // Synthesize based on origin section - match to section rules
        // Only synthesize German feedback content
        allowedTypes: ['feedback']
      },
      2: { // New Vocabulary (English -> German)
        // Don't synthesize English questions, only synthesize German answers in feedback
        allowedTypes: ['feedback']
      },
      3: { // Plural Practice (German singular -> German plural)
        // Synthesize German questions and feedback
        allowedTypes: ['question', 'feedback']
      },
      4: { // Articles in Context
        // For mixed questions, synthesize German words individually
        // For feedback, synthesize full correct answers
        allowedTypes: ['question', 'feedback']
      },
      5: { // Case Translations (English -> German)
        // Don't synthesize English questions, only synthesize German answers in feedback
        allowedTypes: ['feedback']
      },
      6: { // Verb Conjugation
        // Synthesize German verbs individually
        // For feedback, only synthesize correct answer or correction
        allowedTypes: ['question', 'feedback']
      }
    }

    const rule = stepRules[step]
    if (!rule) return false

    return rule.allowedTypes.includes(contentType)
  }

  // Enhanced speak method with step awareness
  speakForStep(step, contentType, text, options = {}) {
    if (!this.shouldSynthesizeForStep(step, contentType)) {
      return Promise.resolve()
    }
    
    return this.speak(text, options)
  }
}

// Create a singleton instance
const speechService = new SpeechSynthesisService()

// Initialize the service
if (typeof window !== 'undefined') {
  speechService.initialize()
}

// Export the speak function as a named export
export const speak = (text, lang = 'de-DE', options = {}) => {
  return speechService.speak(text, options)
}

// Export other useful functions
export const stop = () => speechService.stop()
export const isSpeaking = () => speechService.isSpeaking()
export const getVoices = () => speechService.getVoices()
export const setVoice = (voice) => speechService.setVoice(voice)
export const getCurrentVoice = () => speechService.getCurrentVoice()

export default SpeechSynthesisService
