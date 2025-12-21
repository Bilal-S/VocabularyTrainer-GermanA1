import { useState, useEffect, useCallback, useRef } from 'react'
import SpeechSynthesisService from '../services/speechSynthesisService'
import { LANGUAGE_CONFIG } from '../config/language.js'
import { 
  isSpeechSynthesisSupported, 
  getGermanBrowserSpecificSettings,
  filterGermanVoices,
  sortGermanVoicesByPreference
} from '../utils/textProcessor'

export const useSpeechSynthesis = (initialSettings = {}) => {
  const [isSupported, setIsSupported] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [availableVoices, setAvailableVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [speechSettings, setSpeechSettings] = useState({
    rate: 0.85, // Slightly slower for German clarity
    pitch: 1.0,
    volume: 1.0,
    voiceUri: null,
    autoPronounce: false,
    ...initialSettings
  })
  
  const speechServiceRef = useRef(null)

  // Sync incoming settings with internal state when they change
  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setSpeechSettings(prev => ({
        ...prev,
        ...initialSettings
      }))
    }
  }, [initialSettings.voiceUri, initialSettings.rate, initialSettings.pitch, initialSettings.volume])

  // Initialize speech service
  useEffect(() => {
    if (!isSpeechSynthesisSupported()) {
      console.warn('[useSpeechSynthesis] Speech synthesis not supported')
      setIsSupported(false)
      return
    }

    const service = new SpeechSynthesisService()
    const browserSettings = getGermanBrowserSpecificSettings()
    
    console.log('[useSpeechSynthesis] Browser settings:', browserSettings)
    
    // Initialize with browser-specific settings
    const initialized = service.initialize()
    if (initialized) {
      speechServiceRef.current = service
      setIsSupported(true)
      setIsInitialized(true)
      
      // Load voices with delay for browser compatibility
      const loadVoices = () => {
        const voices = service.getVoices()
        const germanVoices = filterGermanVoices(voices)
        const sortedVoices = sortGermanVoicesByPreference(germanVoices)
        
        console.log(`[useSpeechSynthesis] Loaded ${germanVoices.length} German voices`)
        setAvailableVoices(sortedVoices)
        
        // Only set default voice if no voice is saved in settings
        if (!initialSettings.voiceUri && !selectedVoice && sortedVoices.length > 0) {
          const defaultVoice = service.getCurrentVoice() || sortedVoices[0]
          console.log('[useSpeechSynthesis] Setting default voice:', defaultVoice?.name)
          setSelectedVoice(defaultVoice)
          setSpeechSettings(prev => ({
            ...prev,
            voiceUri: defaultVoice?.voiceURI || null
          }))
        } else if (initialSettings.voiceUri && sortedVoices.length > 0) {
          // If we have a saved voice, use it
          const savedVoice = sortedVoices.find(v => v.voiceURI === initialSettings.voiceUri)
          if (savedVoice) {
            console.log('[useSpeechSynthesis] Using saved voice:', savedVoice.name)
            service.setVoice(savedVoice)
            setSelectedVoice(savedVoice)
          } else {
            console.warn('[useSpeechSynthesis] Saved voice not found:', initialSettings.voiceUri)
          }
        }
      }
      
      // Initial load with browser-specific delay
      console.log(`[useSpeechSynthesis] Scheduling voice load with ${browserSettings.voiceLoadDelay}ms delay`)
      setTimeout(loadVoices, browserSettings.voiceLoadDelay)
      
      // Set up voice change listener for browsers that need it
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  // Update voice when voiceUri changes
  useEffect(() => {
    if (speechServiceRef.current && speechSettings.voiceUri && availableVoices.length > 0) {
      const voice = availableVoices.find(v => v.voiceURI === speechSettings.voiceUri)
      if (voice) {
        speechServiceRef.current.setVoice(voice)
        setSelectedVoice(voice)
      } else if (!speechSettings.voiceUri && availableVoices.length > 0) {
        // If no voiceUri is set, use the default voice from the service
        const defaultVoice = speechServiceRef.current.getCurrentVoice()
        if (defaultVoice) {
          setSelectedVoice(defaultVoice)
          setSpeechSettings(prev => ({
            ...prev,
            voiceUri: defaultVoice.voiceURI || null
          }))
        }
      }
    }
  }, [speechSettings.voiceUri, availableVoices])

  // Monitor speaking state
  useEffect(() => {
    const checkSpeakingState = () => {
      if (speechServiceRef.current) {
        setIsSpeaking(speechServiceRef.current.isSpeaking())
      }
    }

    const interval = setInterval(checkSpeakingState, 100)
    return () => clearInterval(interval)
  }, [])

  // Speak text with specified language
  const speak = useCallback(async (text, language = LANGUAGE_CONFIG.speech.primaryLang, options = {}) => {
    if (!isSupported || !speechServiceRef.current || !text) return

    try {
      setIsSpeaking(true)
      
      const speechOptions = {
        ...speechSettings,
        ...options,
        lang: language
      }

      await speechServiceRef.current.speak(text, speechOptions)
    } catch (error) {
      console.error('Speech synthesis error:', error)
    } finally {
      setIsSpeaking(false)
    }
  }, [isSupported, speechSettings])

  // Speak German text (convenience function)
  const speakGerman = useCallback((text, options = {}) => {
    return speak(text, LANGUAGE_CONFIG.speech.primaryLang, options)
  }, [speak])

  // Speak English text (convenience function)
  const speakEnglish = useCallback((text, options = {}) => {
    return speak(text, 'en-US', options)
  }, [speak])

  // Stop current speech
  const stop = useCallback(() => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stop()
      setIsSpeaking(false)
    }
  }, [])

  // Preview voice with sample text
  const previewVoice = useCallback(async (voice, language = LANGUAGE_CONFIG.speech.primaryLang, customText = null) => {
    if (!voice || !speechServiceRef.current) return

    const sampleText = customText || (language.startsWith('de')
      ? 'Hallo, das ist eine Sprachtest.'
      : 'Hello, this is a voice test.')

    try {
      const service = speechServiceRef.current
      service.setVoice(voice)
      await service.speak(sampleText, {
        lang: language,
        rate: speechSettings.rate,
        pitch: speechSettings.pitch,
        volume: speechSettings.volume
      })
      
      // Restore previous voice
      if (selectedVoice) {
        service.setVoice(selectedVoice)
      }
    } catch (error) {
      console.error('Voice preview error:', error)
    }
  }, [selectedVoice, speechSettings])

  // Update speech settings
  const updateSettings = useCallback((newSettings) => {
    setSpeechSettings(prev => {
      const updated = { ...prev, ...newSettings }
      
      // Update service settings if initialized
      if (speechServiceRef.current) {
        // Voice change is handled by separate effect
        if (newSettings.rate !== undefined) {
          speechServiceRef.current.rate = newSettings.rate
        }
        if (newSettings.pitch !== undefined) {
          speechServiceRef.current.pitch = newSettings.pitch
        }
        if (newSettings.volume !== undefined) {
          speechServiceRef.current.volume = newSettings.volume
        }
      }
      
      return updated
    })
  }, [])

  // Get German voices
  const getGermanVoices = useCallback(() => {
    return availableVoices.filter(voice => voice.lang.startsWith('de-') || voice.lang.startsWith('de_'))
  }, [availableVoices])

  // Get English voices
  const getEnglishVoices = useCallback(() => {
    return availableVoices.filter(voice => voice.lang.startsWith('en-') || voice.lang.startsWith('en_'))
  }, [availableVoices])

  // Refresh voices (useful when voices change)
  const refreshVoices = useCallback(() => {
    if (speechServiceRef.current) {
      const voices = speechServiceRef.current.getVoices()
      const germanVoices = filterGermanVoices(voices)
      const sortedVoices = sortGermanVoicesByPreference(germanVoices)
      setAvailableVoices(sortedVoices)
    }
  }, [])

  // Step-aware speech synthesis
  const speakForStep = useCallback((step, contentType, text, options = {}) => {
    if (!isSupported || !speechServiceRef.current || !text) return Promise.resolve()
    
    // Use the service's step-aware method
    if (speechServiceRef.current.shouldSynthesizeForStep) {
      if (!speechServiceRef.current.shouldSynthesizeForStep(step, contentType)) {
        return Promise.resolve()
      }
    }
    
    try {
      setIsSpeaking(true)
      const speechOptions = {
        ...speechSettings,
        ...options,
        lang: LANGUAGE_CONFIG.speech.primaryLang // Always German for step content
      }
      
      return speechServiceRef.current.speak(text, speechOptions)
    } catch (error) {
      console.error('Speech synthesis error:', error)
      return Promise.resolve()
    } finally {
      setIsSpeaking(false)
    }
  }, [isSupported, speechSettings])

  return {
    // State
    isSupported,
    isInitialized,
    isSpeaking,
    availableVoices,
    selectedVoice,
    speechSettings,
    
    // Voice management
    getGermanVoices,
    getEnglishVoices,
    refreshVoices,
    previewVoice,
    
    // Speech actions
    speak,
    speakGerman,
    speakEnglish,
    stop,
    
    // Settings
    updateSettings,
    setSelectedVoice: (voice) => updateSettings({ voiceUri: voice?.voiceURI || null }),
    
    // Step-aware speech synthesis
    speakForStep
  }
}