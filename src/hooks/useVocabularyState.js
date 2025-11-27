import { useState, useEffect } from 'react'
import { initializeVocabularyPools } from '../data/vocabulary'

const STORAGE_KEY = 'a1-german-coach-state'

const getInitialState = () => {
  const vocabPools = initializeVocabularyPools()
  return {
    userId: 'user-' + Math.random().toString(36).substr(2, 9),
    progress: {},
    pools: vocabPools,
    currentStep: 0,
    batchProgress: {
      answered: [],
      remaining: []
    },
    sessionStats: {
      nounsLearned: 0,
      verbsIntroduced: 0,
      mistakesMade: 0
    },
    lastSessionDate: null
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
        setState(parsedState)
        return parsedState
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
          mistakesMade: 0
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

  const updateProgress = (word, isCorrect) => {
    const newState = { ...state }
    if (!newState.progress[word]) {
      newState.progress[word] = {
        correctCount: 0,
        incorrectCount: 0
      }
    }

    if (isCorrect) {
      newState.progress[word].correctCount++
      
      // Move to mastered if correct 3 times
      if (newState.progress[word].correctCount >= 3) {
        const index = newState.pools.reviewQueue.indexOf(word)
        if (index > -1) {
          newState.pools.reviewQueue.splice(index, 1)
        }
        
        const unselectedIndex = newState.pools.unselected.indexOf(word)
        if (unselectedIndex > -1) {
          newState.pools.unselected.splice(unselectedIndex, 1)
        }
        
        if (!newState.pools.mastered.includes(word)) {
          newState.pools.mastered.push(word)
        }
      }
    } else {
      newState.progress[word].incorrectCount++
      
      // Add to review queue if not already there
      if (!newState.pools.reviewQueue.includes(word)) {
        newState.pools.reviewQueue.push(word)
      }
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

  return {
    state,
    loadState,
    saveState,
    resetState,
    importState,
    exportState,
    updateProgress,
    isNewDay,
    updateSessionStats
  }
}
