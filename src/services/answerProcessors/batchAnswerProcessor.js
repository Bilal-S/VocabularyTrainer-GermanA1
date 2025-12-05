/**
 * Parse batch answer from user input
 * @param {string} answer - User's answer string
 * @returns {Object} Parsed answer structure
 */
export const parseBatchAnswer = (answer) => {
  console.log('handleBatchAnswer called with:', { answer })
  
  const lines = answer.split('\n').filter(line => line.trim())
  const numberedAnswers = []
  const sequentialAnswers = []
  
  lines.forEach(line => {
    // Enhanced regex to match:
    // 1. Answer (space)
    // 1. Answer (dot)
    // 1) Answer (paren)
    // 1- Answer (dash)
    // Captures the number and the answer content
    const match = line.match(/^(\d+)(?:[\.\)\-]\s*|\s+)(.+)$/i)
    
    if (match) {
      numberedAnswers.push({ index: parseInt(match[1]) - 1, answer: match[2].trim() })
    } else if (line.trim()) {
      // For lines not starting with a number, treat as sequential answers for remaining items
      sequentialAnswers.push({ index: null, answer: line.trim() })
    }
  })

  // Check for mixed numbered and sequential answers
  if (numberedAnswers.length > 0 && sequentialAnswers.length > 0) {
    return {
      error: "Mixed formats",
      message: "⚠️ Error: Please provide either all numbered answers (e.g., '1. answer') or all sequential answers (one per line). Mixed formats are not supported."
    }
  }

  return {
    numberedAnswers,
    sequentialAnswers
  }
}

/**
 * Update batch answers with new user input
 * @param {Object} currentBatchAnswers - Current batch answers
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} parsedAnswer - Parsed answer from parseBatchAnswer
 * @returns {Object} Updated answers and newly answered indices
 */
export const updateBatchAnswers = (currentBatchAnswers, currentBatch, parsedAnswer) => {
  if (parsedAnswer.error) {
    return { error: parsedAnswer.error }
  }

  // Get current unanswered items (based on current batchAnswers state)
  const unansweredIndices = currentBatch
    .map((_, index) => index)
    .filter(index => !currentBatchAnswers[index])

  console.log('Current batchAnswers:', currentBatchAnswers)
  console.log('Unanswered indices:', unansweredIndices)
  console.log('Numbered answers:', parsedAnswer.numberedAnswers)
  console.log('Sequential answers:', parsedAnswer.sequentialAnswers)

  // CRITICAL FIX: Update batch answers with proper validation
  const updatedBatchAnswers = { ...currentBatchAnswers }
  const newlyAnsweredIndices = []
  
  if (parsedAnswer.numberedAnswers.length > 0) {
    // Handle numbered answers
    parsedAnswer.numberedAnswers.forEach(answerObj => {
      if (answerObj.index !== null && answerObj.index >= 0 && answerObj.index < currentBatch.length) {
        // Direct numbered answer - use the specified index (if not already answered)
        if (!currentBatchAnswers[answerObj.index]) {
          updatedBatchAnswers[answerObj.index] = answerObj.answer
          newlyAnsweredIndices.push(answerObj.index)
          console.log(`Added numbered answer at index ${answerObj.index}: "${answerObj.answer}"`)
        }
      }
    })
  } else {
    // Handle sequential answers - map to remaining unanswered items in order
    parsedAnswer.sequentialAnswers.forEach((answerObj, i) => {
      if (i < unansweredIndices.length) {
        const targetIndex = unansweredIndices[i]
        updatedBatchAnswers[targetIndex] = answerObj.answer
        newlyAnsweredIndices.push(targetIndex)
        console.log(`Added sequential answer at index ${targetIndex}: "${answerObj.answer}"`)
      }
    })
  }
  
  console.log('Updated batchAnswers:', updatedBatchAnswers)
  console.log('Newly answered indices:', newlyAnsweredIndices)
  
  return {
    updatedBatchAnswers,
    newlyAnsweredIndices,
    totalAnswered: Object.keys(updatedBatchAnswers).length
  }
}

/**
 * Get unanswered items from current batch
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {Array} Array of unanswered exercise items with their indices
 */
export const getUnansweredItems = (currentBatch, batchAnswers) => {
  return currentBatch
    .map((exercise, index) => ({ exercise, index }))
    .filter(({ index }) => !batchAnswers[index])
}

/**
 * Get answered items from current batch
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {Array} Array of answered exercise items with their answers
 */
export const getAnsweredItems = (currentBatch, batchAnswers) => {
  return Object.keys(batchAnswers)
    .map(index => parseInt(index))
    .filter(index => index >= 0 && index < currentBatch.length)
    .map(index => ({
      index,
      exercise: currentBatch[index],
      answer: batchAnswers[index]
    }))
}

/**
 * Check if batch is complete
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {boolean} True if all items have been answered
 */
export const isBatchComplete = (currentBatch, batchAnswers) => {
  if (!currentBatch || currentBatch.length === 0) {
    return false
  }
  
  const answeredCount = Object.keys(batchAnswers).length
  return answeredCount >= currentBatch.length
}

/**
 * Get remaining count for batch
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} batchAnswers - Current batch answers
 * @returns {number} Number of remaining unanswered items
 */
export const getRemainingCount = (currentBatch, batchAnswers) => {
  if (!currentBatch || currentBatch.length === 0) {
    return 0
  }
  
  const answeredCount = Object.keys(batchAnswers).length
  return Math.max(0, currentBatch.length - answeredCount)
}

/**
 * Get prompt for exercise based on type
 * @param {Object} exercise - Exercise object
 * @returns {string} Display prompt for the exercise
 */
export const getExercisePrompt = (exercise) => {
  if (exercise.type === 'article') return exercise.german
  if (exercise.type === 'plural') return exercise.singular
  if (exercise.type === 'conjugation') return `${exercise.verb} (${exercise.subject})`
  return exercise.english || exercise.question || exercise.german
}
