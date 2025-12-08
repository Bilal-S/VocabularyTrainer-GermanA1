import { useState, useEffect } from 'react'
import { initializeVocabularyPools, getTotalVocabularyCount } from '../data/vocabulary/index.js'

const STORAGE_KEY = 'a1-german-coach-state'

// Validate progress structure for dual-form noun mastery
const validateProgressStructure = (progressData) => {
  const validatedProgress = {}
  
  for (const [word, data] of Object.entries(progressData)) {
    // Check if data has old single-counter format (reject)
    if (data.correctCount !== undefined || data.incorrectCount !== undefined) {
      throw new Error(`Invalid progress format for word "${word}": Old single-counter format detected. Please clear all progress data and start fresh with dual-form tracking.`)
    }
    
    // Validate dual-form structure
    if (data.singular && data.plural) {
      // Ensure both forms have required counters
      validatedProgress[word] = {
        singular: {
          correctCount: data.singular.correctCount || 0,
          incorrectCount: data.singular.incorrectCount || 0
        },
        plural: {
          correctCount: data.plural.correctCount || 0,
          incorrectCount: data.plural.incorrectCount || 0
        },
        section: data.section || 'Unknown'
      }
    } else {
      // Default to empty dual-form structure for invalid data
      console.warn(`Invalid progress data for word "${word}", initializing fresh`)
      validatedProgress[word] = {
        singular: { correctCount: 0, incorrectCount: 0 },
        plural: { correctCount: 0, incorrectCount: 0 },
        section: data.section || 'Unknown'
      }
    }
  }
  
  return validatedProgress
}

const getInitialState = () => {
  const vocabPools = initializeVocabularyPools()
  return {
    userId: 'user-' + Math.random().toString(36).substr(2, 9),
    settings: {
      masteringCount: 1,
      maxReviewBatchSize: 50,
      maxReviewCount: 3
    },
    progress: {},
    pools: {
      unselected: [], // Start empty - words get moved here as they're used (internal only)
      mastered: {
        nouns: [],
        verbs: [],
        words: []
      },   // Words with correctCount >= masteringCount
      reviewQueue: [] // Words with incorrect answers
      // available: REMOVED - redundant with database data
      // Note: unselected is not exported (session-specific data)
    },
    currentStep: 0,
    batchProgress: {
      answered: [],
      remaining: []
    },
    sessionStats: {
      nounsLearned: 0,
      verbsIntroduced: 0,
      mistakesMade: 0,
      itemsAddedToReview: 0
    },
    lastSessionDate: null,
    currentSessionStats: {
      nounsLearnedToday: 0,
      verbsIntroducedToday: 0,
      mistakesMadeToday: 0,
      itemsAddedToReviewToday: 0,
      initialReviewQueueSize: 0
    }
  }
}

export const useVocabularyState = () => {
  const [state, setState] = useState(getInitialState())

  // Load state from localStorage on mount
  useEffect(() => {
    loadState()
  }, [])

  const loadState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        
        // Check if same day to preserve session stats
        const today = new Date().toISOString().split('T')[0]
        const isSameDay = parsedState.lastSessionDate === today
        
        let currentSessionStats
        
        if (isSameDay && parsedState.currentSessionStats) {
          // Preserve stats if reloading on the same day
          currentSessionStats = parsedState.currentSessionStats
        } else {
          // New day or no stats: Reset
          currentSessionStats = {
            nounsLearnedToday: 0,
            verbsIntroducedToday: 0,
            mistakesMadeToday: 0,
            itemsAddedToReviewToday: 0,
            initialReviewQueueSize: parsedState.pools.reviewQueue.length
          }
        }

        const stateWithSession = {
          ...parsedState,
          currentSessionStats
        }
        setState(stateWithSession)
        return stateWithSession
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
    }
    return null
  }

  const saveState = (newState = state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      setState(newState)
    } catch (error) {
      console.error('Error saving state to localStorage:', error)
    }
  }

  const resetState = () => {
    const freshState = getInitialState()
    setState(freshState)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  const importState = (jsonData) => {
    try {
      // Validate the imported data structure
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Invalid data format')
      }

      // Ensure required fields exist
      const freshState = getInitialState()
      const validatedState = {
        ...freshState,
        ...jsonData,
        // Preserve original userId if not provided
        userId: jsonData.userId || freshState.userId,
        // Ensure settings exist
        settings: {
          masteringCount: jsonData.settings?.masteringCount || 1,
          maxReviewBatchSize: jsonData.settings?.maxReviewBatchSize || 50,
          maxReviewCount: jsonData.settings?.maxReviewCount || 3
        },
        // Ensure pools exist - only import permanent data, reset session-specific data
        pools: {
          unselected: [], // Always start fresh - session-specific data not imported
          mastered: jsonData.pools?.mastered || {
            nouns: [],
            verbs: [],
            words: []
          },
          reviewQueue: jsonData.pools?.reviewQueue || []
          // Note: 'available' field is ignored - redundant database data
        },
      // Validate and ensure progress exists with dual-form structure
      progress: validateProgressStructure(jsonData.progress || {}),
        // Ensure other fields exist
        currentStep: jsonData.currentStep || 0,
        batchProgress: jsonData.batchProgress || {
          answered: [],
          remaining: []
        },
        sessionStats: jsonData.sessionStats || {
          nounsLearned: 0,
          verbsIntroduced: 0,
          mistakesMade: 0,
          itemsAddedToReview: 0
        },
        // Initialize current session stats
        currentSessionStats: {
          nounsLearnedToday: 0,
          verbsIntroducedToday: 0,
          mistakesMadeToday: 0,
          itemsAddedToReviewToday: 0,
          initialReviewQueueSize: jsonData.pools?.reviewQueue?.length || 0
        }
      }

      saveState(validatedState)
      return true
    } catch (error) {
      console.error('Error importing state:', error)
      return false
    }
  }

  const exportState = () => {
    try {
      // Create export data without session-specific fields
      const exportData = {
        ...state,
        pools: {
          mastered: state.pools.mastered,
          reviewQueue: state.pools.reviewQueue
          // unselected excluded - session-specific data
        }
        // Note: currentSessionStats is session-specific and will be excluded by the replacer
      }
      
      // Custom replacer to exclude session-specific fields
      const replacer = (key, value) => {
        const excludeKeys = ['currentSessionStats', 'unselected', 'available']
        return excludeKeys.includes(key) ? undefined : value
      }
      
      const dataStr = JSON.stringify(exportData, replacer, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `a1-german-coach-progress-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting state:', error)
    }
  }

  const updateProgress = (word, isCorrect, section = 'Unknown', form = 'singular') => {
    const newState = { ...state }
    if (!newState.progress[word]) {
      newState.progress[word] = {
        singular: { correctCount: 0, incorrectCount: 0 },
        plural: { correctCount: 0, incorrectCount: 0 },
        section: section
      }
    }

    let wasAddedToReview = false
    let wasMovedToMastered = false

    if (isCorrect) {
      // Update correct count for specific form
      newState.progress[word][form].correctCount++
      
      // Determine if item is in review queue to use correct mastering threshold
      const isInReviewQueue = newState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === word : item.word === word
      ) > -1
      
      // change which threshold to use based on review queue status
      const masteringThreshold = isInReviewQueue 
        ? newState.settings.maxReviewCount 
        : newState.settings.masteringCount
      
      // Check if word is mastered based on section and form
      const isWordMastered = (wordData) => {
        if (!wordData || wordData.singular === undefined || wordData.plural === undefined) {
          return false
        }
        
        // For review queue items, only the form that caused the failure needs to reach maxReviewCount
        if (isInReviewQueue) {
          if (form === 'singular') {
            return wordData.singular.correctCount >= masteringThreshold
          } else if (form === 'plural') {
            return wordData.plural.correctCount >= masteringThreshold
          }
        }
        
        // For new items (not in review queue), require both forms to be mastered
        const singularMastered = wordData.singular.correctCount >= masteringThreshold
        const pluralMastered = wordData.plural.correctCount >= masteringThreshold
        
        if (section === 'VOCABULARY' || section === 'PLURAL') {
          return singularMastered && pluralMastered
        }
        
        // For verbs and other word types, only require tested form
        return singularMastered
      }
      
      // Check if word should be removed from review queue (specific form mastered)
      // This is distinct from full mastery (all forms mastered)
      let shouldRemoveFromReview = false
      if (isInReviewQueue) {
        // Only consider the form that was being tested/failed
        if (form === 'singular' && newState.progress[word].singular.correctCount >= masteringThreshold) {
          shouldRemoveFromReview = true
        } else if (form === 'plural' && newState.progress[word].plural.correctCount >= masteringThreshold) {
          shouldRemoveFromReview = true
        } else if (section === 'VERBS' && newState.progress[word].singular.correctCount >= masteringThreshold) {
          // Verbs currently use singular structure for tracking
          shouldRemoveFromReview = true
        }
      }

      // Check if word is FULLY mastered (all required forms meet criteria)
      // For Nouns (VOCABULARY/PLURAL sections), this requires BOTH Singular and Plural
      let isFullyMastered = false
      if (section === 'VOCABULARY' || section === 'PLURAL') {
        const singularMastered = newState.progress[word].singular.correctCount >= newState.settings.masteringCount
        const pluralMastered = newState.progress[word].plural.correctCount >= newState.settings.masteringCount
        isFullyMastered = singularMastered && pluralMastered
      } else {
        // For verbs/others, basic check
        isFullyMastered = newState.progress[word].singular.correctCount >= newState.settings.masteringCount
      }

      // 1. Remove from Review Queue if specific form is mastered
      if (shouldRemoveFromReview) {
        const reviewIndex = newState.pools.reviewQueue.findIndex(item => 
          typeof item === 'string' ? item === word : item.word === word
        )
        if (reviewIndex > -1) {
          newState.pools.reviewQueue.splice(reviewIndex, 1)
        }
      }

      // 2. Add to Mastered Pool ONLY if fully mastered
      if (isFullyMastered) {
        // Ensure removed from review queue (redundant safety)
        const reviewIndex = newState.pools.reviewQueue.findIndex(item => 
          typeof item === 'string' ? item === word : item.word === word
        )
        if (reviewIndex > -1) {
          newState.pools.reviewQueue.splice(reviewIndex, 1)
        }

        // Remove from unselected if present
        const unselectedIndex = newState.pools.unselected.indexOf(word)
        if (unselectedIndex > -1) {
          newState.pools.unselected.splice(unselectedIndex, 1)
        }
        
        // Add to appropriate mastered category
        if (!newState.pools.mastered.nouns.includes(word) && 
            !newState.pools.mastered.verbs.includes(word) && 
            !newState.pools.mastered.words.includes(word)) {
          
          // Determine word type based on section (simple heuristic)
          if (section === 'VOCABULARY' || section === 'PLURAL') {
            newState.pools.mastered.nouns.push(word)
          } else if (section === 'VERBS') {
            newState.pools.mastered.verbs.push(word)
          } else {
            newState.pools.mastered.words.push(word)
          }
          wasMovedToMastered = true
        }
      }
    } else {
      // Update incorrect count for specific form
      newState.progress[word][form].incorrectCount++
      
      // Add to review queue with section info if not already there
      const existsInReview = newState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === word : item.word === word
      )
      if (existsInReview === -1) {
        newState.pools.reviewQueue.push({ word, section })
        wasAddedToReview = true
      }

      // Update current session stats for mistakes
      newState.currentSessionStats.mistakesMadeToday++
      newState.sessionStats.mistakesMade++
    }

    // Update current session stats for review queue changes
    if (wasAddedToReview) {
      newState.currentSessionStats.itemsAddedToReviewToday++
      newState.sessionStats.itemsAddedToReview++
    }

    saveState(newState)
    return newState
  }

  const trackSessionLearning = (type, count = 1) => {
    const newState = { ...state }
    
    switch (type) {
      case 'nouns':
        newState.currentSessionStats.nounsLearnedToday += count
        newState.sessionStats.nounsLearned += count
        break
      case 'verbs':
        newState.currentSessionStats.verbsIntroducedToday += count
        newState.sessionStats.verbsIntroduced += count
        break
    }
    
    saveState(newState)
    return newState
  }

  const getSessionDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const isNewDay = () => {
    const today = getSessionDate()
    return state.lastSessionDate !== today
  }

  const updateSessionStats = (stats) => {
    const newState = {
      ...state,
      sessionStats: {
        ...state.sessionStats,
        ...stats
      },
      lastSessionDate: getSessionDate()
    }
    saveState(newState)
    return newState
  }

  const getCurrentSessionStats = () => {
    // Calculate mastered count from new structure
    const masteredCount = Array.isArray(state.pools.mastered) 
      ? state.pools.mastered.length 
      : (state.pools.mastered.nouns?.length || 0) + 
        (state.pools.mastered.verbs?.length || 0) + 
        (state.pools.mastered.words?.length || 0)
    
    const totalAvailable = getTotalVocabularyCount() // Total words in database
    const inReviewCount = state.pools.reviewQueue.length
    const remainingCount = Math.max(0, totalAvailable - masteredCount - inReviewCount)

    return {
      nounsLearned: state.currentSessionStats.nounsLearnedToday,
      verbsIntroduced: state.currentSessionStats.verbsIntroducedToday,
      mistakesMade: state.currentSessionStats.mistakesMadeToday,
      itemsAddedToReview: state.currentSessionStats.itemsAddedToReviewToday,
      itemsRemainingInReview: state.pools.reviewQueue.length,
      initialReviewQueueSize: state.currentSessionStats.initialReviewQueueSize,
      totalMastered: masteredCount,
      totalRemaining: remainingCount
    }
  }

  const updateSettings = (newSettings) => {
    const newState = {
      ...state,
      settings: {
        ...state.settings,
        ...newSettings
      }
    }
    saveState(newState)
    return newState
  }

  const getSettings = () => {
    return state.settings
  }

  return {
    state,
    loadState,
    saveState,
    resetState,
    importState,
    exportState,
    updateProgress,
    trackSessionLearning,
    isNewDay,
    updateSessionStats,
    getCurrentSessionStats,
    updateSettings,
    getSettings
  }
}
