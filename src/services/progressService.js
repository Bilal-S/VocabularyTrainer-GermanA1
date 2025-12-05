import { stepHasQuestions } from './stepService.js'

/**
 * Check if the current step is complete based on progress and batch status
 * @param {number} currentStep - Current step number
 * @param {Object} batchProgress - Current batch progress
 * @param {boolean} isBatchMode - Whether in batch mode
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {boolean} True if step is complete
 */
export const isStepComplete = (currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers) => {
  // Intro and Recap steps are always considered complete
  if (!stepHasQuestions(currentStep)) {
    return true
  }
  
  // For batch mode, check if all items in current batch have been answered
  if (isBatchMode && currentBatch && currentBatch.length > 0) {
    return Object.keys(batchAnswers).length >= currentBatch.length
  }
  
  // For single question mode, check if batch progress is complete
  return batchProgress.completed >= batchProgress.total && batchProgress.total > 0
}

/**
 * Get the number of remaining questions for the current step
 * @param {number} currentStep - Current step number
 * @param {Object} batchProgress - Current batch progress
 * @param {boolean} isBatchMode - Whether in batch mode
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {number} Number of remaining questions
 */
export const getRemainingQuestions = (currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers) => {
  // Intro and Recap steps have no questions
  if (!stepHasQuestions(currentStep)) {
    return 0
  }
  
  // For batch mode, count unanswered items in current batch
  if (isBatchMode && currentBatch && currentBatch.length > 0) {
    return currentBatch.length - Object.keys(batchAnswers).length
  }
  
  // For single question mode, use batch progress
  return Math.max(0, batchProgress.total - batchProgress.completed)
}

/**
 * Calculate progress percentage for a step
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgressPercentage = (completed, total) => {
  return total > 0 ? Math.round((completed / total) * 100) : 100
}

/**
 * Get step progress information for UI display
 * @param {number} currentStep - Current step number
 * @param {Object} batchProgress - Current batch progress
 * @returns {Object} Progress information with completed, total, and percentage
 */
export const getSectionProgress = (currentStep, batchProgress) => {
  if (!stepHasQuestions(currentStep)) {
    return { completed: 0, total: 1, percentage: 100 }
  }
  
  return {
    completed: batchProgress.completed,
    total: batchProgress.total,
    percentage: calculateProgressPercentage(batchProgress.completed, batchProgress.total)
  }
}

/**
 * Check if user can proceed to next step
 * @param {number} currentStep - Current step number
 * @param {Object} batchProgress - Current batch progress
 * @param {boolean} isBatchMode - Whether in batch mode
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {boolean} True if user can proceed
 */
export const canProceedToNextStep = (currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers) => {
  // Always allow proceeding from intro/recap
  if (!stepHasQuestions(currentStep)) {
    return true
  }
  
  return isStepComplete(currentStep, batchProgress, isBatchMode, currentBatch, batchAnswers)
}

/**
 * Get progress summary for display
 * @param {Object} sessionStats - Current session statistics
 * @param {Object} currentSessionStats - Current session stats
 * @param {number} currentStep - Current step number
 * @returns {Object} Formatted progress summary
 */
export const getProgressSummary = (sessionStats, currentSessionStats, currentStep) => {
  return {
    nounsLearned: currentSessionStats.nounsLearnedToday,
    verbsIntroduced: currentSessionStats.verbsIntroducedToday,
    mistakesMade: currentSessionStats.mistakesMadeToday,
    itemsAddedToReview: currentSessionStats.itemsAddedToReviewToday,
    itemsRemainingInReview: sessionStats.pools?.reviewQueue?.length || 0,
    initialReviewQueueSize: currentSessionStats.initialReviewQueueSize,
    totalMastered: sessionStats.pools?.mastered?.length || 0,
    totalRemaining: sessionStats.totalRemaining || 0,
    currentStepText: getCurrentStepText(currentStep)
  }
}

/**
 * Get human-readable current step text
 * @param {number} currentStep - Current step number
 * @returns {string} Human-readable step description
 */
const getCurrentStepText = (currentStep) => {
  if (currentStep === 0) return 'Not started'
  if (currentStep === 7) return 'Daily routine complete!'
  return `Step ${currentStep} of 7`
}
