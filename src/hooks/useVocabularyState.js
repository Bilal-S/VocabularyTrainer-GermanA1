import { useState, useEffect } from 'react'
import { initializeVocabularyPools, getTotalVocabularyCount } from '../data/vocabulary/index.js'

const STORAGE_KEY = 'a1-german-coach-state'

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
        // Initialize current session stats when loading
        const stateWithSession = {
          ...parsedState,
          currentSessionStats: {
            nounsLearnedToday: 0,
            verbsIntroducedToday: 0,
            mistakesMadeToday: 0,
            itemsAddedToReviewToday: 0,
            initialReviewQueueSize: parsedState.pools.reviewQueue.length
          }
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
        // Ensure progress exists
        progress: jsonData.progress || {},
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

  const updateProgress = (word, isCorrect, section = 'Unknown') => {
    const newState = { ...state }
    if (!newState.progress[word]) {
      newState.progress[word] = {
        correctCount: 0,
        incorrectCount: 0,
        section: section
      }
    }

    let wasAddedToReview = false
    let wasMovedToMastered = false

    if (isCorrect) {
      newState.progress[word].correctCount++
      
      // Determine if item is in review queue to use correct mastering threshold
      const isInReviewQueue = newState.pools.reviewQueue.findIndex(item => 
        typeof item === 'string' ? item === word : item.word === word
      ) > -1
      
      const masteringThreshold = isInReviewQueue 
        ? newState.settings.maxReviewCount 
        : newState.settings.masteringCount
      
      // Move to mastered if correct count reaches threshold
      if (newState.progress[word].correctCount >= masteringThreshold) {
        // Remove from review queue if present
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
      newState.progress[word].incorrectCount++
      
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
