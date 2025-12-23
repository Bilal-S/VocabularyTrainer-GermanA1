import React, { useState, useEffect } from 'react'
import SpeechIcon from './SpeechIcon'
import { germanSpeechConfig } from '../config/language'

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState({
    masteringCount: settings?.masteringCount || 1,
    maxReviewBatchSize: settings?.maxReviewBatchSize || 10,
    maxReviewCount: settings?.maxReviewCount || 3,
    maxVocabularyQuestions: settings?.maxVocabularyQuestions || 10,
    maxPluralQuestions: settings?.maxPluralQuestions || 10,
    maxArticlesQuestions: settings?.maxArticlesQuestions || 10,
    maxTranslationsQuestions: settings?.maxTranslationsQuestions || 10,
    maxVerbsQuestions: settings?.maxVerbsQuestions || 10,
    speechSettings: {
      enabled: settings?.speechSettings?.enabled !== false,
      rate: settings?.speechSettings?.rate || 0.9,
      pitch: settings?.speechSettings?.pitch || 1.0,
      volume: settings?.speechSettings?.volume || 1.0,
      voiceUri: settings?.speechSettings?.voiceUri || null,
      autoPronounce: settings?.speechSettings?.autoPronounce || false
    }
  })

  // State for speech synthesis
  const [speechVoices, setSpeechVoices] = useState([])
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  // Update local settings when props change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        masteringCount: settings.masteringCount || 1,
        maxReviewBatchSize: settings.maxReviewBatchSize || 10,
        maxReviewCount: settings.maxReviewCount || 3,
        maxVocabularyQuestions: settings.maxVocabularyQuestions || 10,
        maxPluralQuestions: settings.maxPluralQuestions || 10,
        maxArticlesQuestions: settings.maxArticlesQuestions || 10,
        maxTranslationsQuestions: settings.maxTranslationsQuestions || 10,
        maxVerbsQuestions: settings.maxVerbsQuestions || 10,
        speechSettings: {
          enabled: settings.speechSettings?.enabled !== false,
          rate: settings.speechSettings?.rate || 0.9,
          pitch: settings.speechSettings?.pitch || 1.0,
          volume: settings.speechSettings?.volume || 1.0,
          voiceUri: settings.speechSettings?.voiceUri || null,
          autoPronounce: settings.speechSettings?.autoPronounce || false
        }
      })
    }
  }, [settings])

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSpeechSupported(false)
      return
    }

    setIsSpeechSupported(true)
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      console.log('Available voices:', voices)
      setSpeechVoices(voices)
      setVoicesLoaded(true)
    }

    // Initial load
    loadVoices()

    // Set up voice change listener for browsers that need it
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Fallback timeout for browsers that don't fire the event properly
    const timeoutId = setTimeout(() => {
      if (!voicesLoaded) {
        console.log('Voice loading timeout - forcing reload')
        loadVoices()
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [voicesLoaded])

  // Handle initial voice selection when component mounts
  useEffect(() => {
    if (voicesLoaded && speechVoices.length > 0 && !localSettings.speechSettings.voiceUri) {
      console.log('Performing initial voice selection...')

      // German voice priority: de-DE -> de_* -> default
      const germanVoices = speechVoices.filter(voice =>
        germanSpeechConfig.languages.includes(voice.lang) ||
        voice.lang.startsWith('de-') ||
        voice.lang.startsWith('de_')
      )
      
      let selectedVoice = null
      if (germanVoices.length > 0) {
        selectedVoice = germanVoices[0]
        console.log('Auto-selecting initial German voice:', selectedVoice.name)
      } else {
        console.log('No German voice found for initial selection, using browser default.')
      }

      if (selectedVoice) {
        setLocalSettings(prev => ({
          ...prev,
          speechSettings: {
            ...prev.speechSettings,
            voiceUri: selectedVoice.voiceURI
          }
        }))
      }
    }
  }, [voicesLoaded, speechVoices, localSettings.speechSettings.voiceUri])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate inputs
    const newSettings = {
      masteringCount: Math.max(1, Math.min(9, parseInt(localSettings.masteringCount) || 1)),
      maxReviewBatchSize: Math.max(10, Math.min(99, parseInt(localSettings.maxReviewBatchSize) || 10)),
      maxReviewCount: Math.max(1, Math.min(9, parseInt(localSettings.maxReviewCount) || 3)),
      maxVocabularyQuestions: Math.max(1, Math.min(40, parseInt(localSettings.maxVocabularyQuestions) || 10)),
      maxPluralQuestions: Math.max(1, Math.min(40, parseInt(localSettings.maxPluralQuestions) || 10)),
      maxArticlesQuestions: Math.max(1, Math.min(40, parseInt(localSettings.maxArticlesQuestions) || 10)),
      maxTranslationsQuestions: Math.max(1, Math.min(40, parseInt(localSettings.maxTranslationsQuestions) || 10)),
      maxVerbsQuestions: Math.max(1, Math.min(40, parseInt(localSettings.maxVerbsQuestions) || 10))
    }
    
    // Include speech settings in the saved settings
    newSettings.speechSettings = localSettings.speechSettings
    
    onSave(newSettings)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSpeechSettingChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      speechSettings: {
        ...prev.speechSettings,
        [field]: value
      }
    }))
  }

  const handlePreviewVoice = async () => {
    if (!localSettings.speechSettings.voiceUri || !isSpeechSupported) return
    
    const selectedVoice = speechVoices.find(v => v.voiceURI === localSettings.speechSettings.voiceUri)
    if (!selectedVoice) return
    
    setIsPreviewingVoice(true)
    try {
      // Use a sample German text for testing
      const sampleText = "Hallo, dies ist ein Sprachtest. Wie geht es dir heute? "
      
      // Create utterance for preview
      const utterance = new SpeechSynthesisUtterance(sampleText)
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice.lang || 'de-DE' || 'de_DE'
      utterance.rate = localSettings.speechSettings.rate || 0.9
      utterance.pitch = localSettings.speechSettings.pitch || 1.0
      utterance.volume = localSettings.speechSettings.volume || 1.0
      
      // Event handlers
      utterance.onend = () => {
        setIsPreviewingVoice(false)
      }
      
      utterance.onerror = (event) => {
        console.error('Voice preview error:', event.error)
        setIsPreviewingVoice(false)
      }
      
      // Cancel any ongoing speech and speak
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Voice preview error:', error)
      setIsPreviewingVoice(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Full Screen Settings */}
      <div className="fixed inset-0 bg-white z-40">
        {/* Header with Close Button */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mastering Count */}
              <div>
                <label htmlFor="masteringCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Mastering Count
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  How many correct answers needed to master a new word (1-9, default: 1)
                </p>
                <input
                  type="number"
                  id="masteringCount"
                  min="1"
                  max="9"
                  value={localSettings.masteringCount}
                  onChange={(e) => handleInputChange('masteringCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Review Count */}
              <div>
                <label htmlFor="maxReviewCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Count
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  How many correct answers needed to master a review item (1-9, default: 3)
                </p>
                <input
                  type="number"
                  id="maxReviewCount"
                  min="1"
                  max="9"
                  value={localSettings.maxReviewCount}
                  onChange={(e) => handleInputChange('maxReviewCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Review Batch Size */}
              <div>
                <label htmlFor="maxReviewBatchSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Batch Size
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Maximum number of items to review per session (10-99, default: 50)
                </p>
                <input
                  type="number"
                  id="maxReviewBatchSize"
                  min="10"
                  max="99"
                  value={localSettings.maxReviewBatchSize}
                  onChange={(e) => handleInputChange('maxReviewBatchSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Step-specific Settings */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Step 2-6 Question Limits</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Step 2: Vocabulary Questions */}
                  <div>
                    <label htmlFor="maxVocabularyQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                      Step 2: New Vocabulary Questions
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum questions for vocabulary practice (1-40, default: 20)
                    </p>
                    <input
                      type="number"
                      id="maxVocabularyQuestions"
                      min="1"
                      max="40"
                      value={localSettings.maxVocabularyQuestions}
                      onChange={(e) => handleInputChange('maxVocabularyQuestions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => window.speakText && window.speakText('Vocabulary practice example', 2)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
                        title="Test speech for vocabulary step"
                      >
                        
                        <span className="text-sm">Test Speech</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Plural Questions */}
                  <div>
                    <label htmlFor="maxPluralQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                      Step 3: Plural Practice Questions
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum questions for plural practice (1-40, default: 20)
                    </p>
                    <input
                      type="number"
                      id="maxPluralQuestions"
                      min="1"
                      max="40"
                      value={localSettings.maxPluralQuestions}
                      onChange={(e) => handleInputChange('maxPluralQuestions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => window.speakText && window.speakText('Plural practice example', 3)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
                        title="Test speech for plural step"
                      >
                        <span className="text-sm">Test Speech</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 4: Articles Questions */}
                  <div>
                    <label htmlFor="maxArticlesQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                      Step 4: Articles in Context Questions
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum questions for articles practice (1-40, default: 30)
                    </p>
                    <input
                      type="number"
                      id="maxArticlesQuestions"
                      min="1"
                      max="40"
                      value={localSettings.maxArticlesQuestions}
                      onChange={(e) => handleInputChange('maxArticlesQuestions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => window.speakText && window.speakText('Articles practice example', 4)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
                        title="Test speech for articles step"
                      >
                       
                        <span className="text-sm">Test Speech</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 5: Translations Questions */}
                  <div>
                    <label htmlFor="maxTranslationsQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                      Step 5: Case Translations Questions
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum questions for translation practice (1-40, default: 30)
                    </p>
                    <input
                      type="number"
                      id="maxTranslationsQuestions"
                      min="1"
                      max="40"
                      value={localSettings.maxTranslationsQuestions}
                      onChange={(e) => handleInputChange('maxTranslationsQuestions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => window.speakText && window.speakText('Translation practice example', 5)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
                        title="Test speech for translations step"
                      >
                       
                        <span className="text-sm">Test Speech</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 6: Verbs Questions */}
                  <div>
                    <label htmlFor="maxVerbsQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                      Step 6: Verb Conjugation Questions
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum questions for verb conjugation (1-40, default: 30)
                    </p>
                    <input
                      type="number"
                      id="maxVerbsQuestions"
                      min="1"
                      max="40"
                      value={localSettings.maxVerbsQuestions}
                      onChange={(e) => handleInputChange('maxVerbsQuestions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => window.speakText && window.speakText('Verb conjugation example', 6)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
                        title="Test speech for verbs step"
                      >
                        
                        <span className="text-sm">Test Speech</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speech Settings */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Speech Settings</h3>
                
                {/* Speech Enabled */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localSettings.speechSettings.enabled}
                      onChange={(e) => handleSpeechSettingChange('enabled', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable speech synthesis</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Enable pronunciation buttons for German text
                  </p>
                </div>

                {localSettings.speechSettings.enabled && (
                  <div className="space-y-6">
                    {/* Auto-pronounce */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localSettings.speechSettings.autoPronounce}
                          onChange={(e) => handleSpeechSettingChange('autoPronounce', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Auto-pronounce German words</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically pronounce German words when displayed
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Speech Rate */}
                      <div>
                        <label htmlFor="speechRate" className="block text-sm font-medium text-gray-700 mb-1">
                          Speech Rate: {localSettings.speechSettings.rate.toFixed(1)}
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Speed of speech synthesis (0.5-1.5, default: 0.9)
                        </p>
                        <input
                          type="range"
                          id="speechRate"
                          min="0.5"
                          max="1.5"
                          step="0.1"
                          value={localSettings.speechSettings.rate}
                          onChange={(e) => handleSpeechSettingChange('rate', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Speech Volume */}
                      <div>
                        <label htmlFor="speechVolume" className="block text-sm font-medium text-gray-700 mb-1">
                          Speech Volume: {Math.round(localSettings.speechSettings.volume * 100)}%
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Volume of speech synthesis (0-100%, default: 100%)
                        </p>
                        <input
                          type="range"
                          id="speechVolume"
                          min="0"
                          max="1"
                          step="0.1"
                          value={localSettings.speechSettings.volume}
                          onChange={(e) => handleSpeechSettingChange('volume', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Voice Selection */}
                    <div>
                      <label htmlFor="voiceSelection" className="block text-sm font-medium text-gray-700 mb-1">
                        Voice Selection
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Choose preferred German voice for pronunciation
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <select
                          id="voiceSelection"
                          value={localSettings.speechSettings.voiceUri || ''}
                          onChange={(e) => handleSpeechSettingChange('voiceUri', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={!isSpeechSupported || speechVoices.length === 0}
                        >
                          {speechVoices.filter(voice =>
                            germanSpeechConfig.languages.includes(voice.lang) ||
                            voice.lang.startsWith('de-') ||
                            voice.lang.startsWith('de_')
                          ).map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                              {voice.name} ({voice.lang}) {voice.default ? ' - DEFAULT' : ''}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handlePreviewVoice}
                          disabled={!isSpeechSupported || !localSettings.speechSettings.voiceUri || isPreviewingVoice}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                        >
                          {isPreviewingVoice ? 'Playing...' : 'Test Voice'}
                        </button>
                      </div>
                      {!isSpeechSupported && (
                        <p className="text-xs text-red-500 mt-1">
                          Speech synthesis is not supported in your browser
                        </p>
                      )}
                      {isSpeechSupported && !voicesLoaded && speechVoices.length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">
                          Loading voices... Please wait a moment.
                        </p>
                      )}
                      {isSpeechSupported && voicesLoaded && speechVoices.filter(v =>
                        germanSpeechConfig.languages.includes(v.lang) ||
                        v.lang.startsWith('de-') ||
                        v.lang.startsWith('de_')
                      ).length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">
                          No German voices found in your browser. Consider using Chrome or Edge for better German voice support.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsModal
