import { useState, useEffect } from 'react'
import { initializeVocabularyPools, getTotalVocabularyCount } from '../data/vocabulary/index.js'

const STORAGE_KEY = 'a1-german-coach-state'

const getInitialState = () => {
  const vocabPools = initializeVocabularyPools()
  return {
    userId: 'user-' + Math.random().toString(36).substr(2, 9),
    progress: {},
    pools: {
      unselected: [], // Start empty - words get moved here as they're used
      mastered: [],   // Words with 3+ correct answers
      reviewQueue: [], // Words with incorrect answers
      available: vocabPools.unselected // All available words for selection
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
        // Ensure pools exist
        pools: {
          unselected: jsonData.pools?.unselected || [],
          mastered: jsonData.pools?.mastered || [],
          reviewQueue: jsonData.pools?.reviewQueue || []
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
      const dataStr = JSON.stringify(state, null, 2)
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
      
      // Move to mastered if correct 3 times
      if (newState.progress[word].correctCount >= 3) {
        const index = newState.pools.reviewQueue.findIndex(item => 
          typeof item === 'string' ? item === word : item.word === word
        )
        if (index > -1) {
          newState.pools.reviewQueue.splice(index, 1)
        }
        
        const unselectedIndex = newState.pools.unselected.indexOf(word)
        if (unselectedIndex > -1) {
          newState.pools.unselected.splice(unselectedIndex, 1)
        }
        
        if (!newState.pools.mastered.includes(word)) {
          newState.pools.mastered.push(word)
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
    // SIMPLIFIED FIX: Calculate remaining A1 words correctly
    const totalAvailable = getTotalVocabularyCount() // Total words in database
    const masteredCount = state.pools.mastered.length
    const inReviewCount = state.pools.reviewQueue.length
    const remainingCount = Math.max(0, totalAvailable - masteredCount - inReviewCount)

    return {
      nounsLearned: state.currentSessionStats.nounsLearnedToday,
      verbsIntroduced: state.currentSessionStats.verbsIntroducedToday,
      mistakesMade: state.currentSessionStats.mistakesMadeToday,
      itemsAddedToReview: state.currentSessionStats.itemsAddedToReviewToday,
      itemsRemainingInReview: state.pools.reviewQueue.length,
      initialReviewQueueSize: state.currentSessionStats.initialReviewQueueSize,
      totalMastered: state.pools.mastered.length,
      totalRemaining: remainingCount
    }
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
    getCurrentSessionStats
  }
}
