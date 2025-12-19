import React, { useState, useEffect } from 'react'

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState({
    masteringCount: settings?.masteringCount || 1,
    maxReviewBatchSize: settings?.maxReviewBatchSize || 10,
    maxReviewCount: settings?.maxReviewCount || 3,
    maxVocabularyQuestions: settings?.maxVocabularyQuestions || 10,
    maxPluralQuestions: settings?.maxPluralQuestions || 10,
    maxArticlesQuestions: settings?.maxArticlesQuestions || 10,
    maxTranslationsQuestions: settings?.maxTranslationsQuestions || 10,
    maxVerbsQuestions: settings?.maxVerbsQuestions || 10
  })

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
        maxVerbsQuestions: settings.maxVerbsQuestions || 10
      })
    }
  }, [settings])

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
    
    onSave(newSettings)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Step 2-6 Question Limits</h3>
                
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
                </div>

                {/* Step 3: Plural Questions */}
                <div className="mt-4">
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
                </div>

                {/* Step 4: Articles Questions */}
                <div className="mt-4">
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
                </div>

                {/* Step 5: Translations Questions */}
                <div className="mt-4">
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
                </div>

                {/* Step 6: Verbs Questions */}
                <div className="mt-4">
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
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
