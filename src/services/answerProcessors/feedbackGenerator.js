import { getExercisePrompt } from './batchAnswerProcessor.js'
import { validationService } from './validationService.js'

/**
 * Generate batch feedback for newly answered items
 * @param {Object} allAnswers - All batch answers
 * @param {Array} newlyAnsweredIndices - Newly answered item indices
 * @param {Array} currentBatch - Current batch of exercises
 * @param {number} currentStep - Current step number
 * @param {Object} vocabManager - VocabularyManager instance
 * @returns {string} Feedback message
 */
export const generateBatchFeedback = (allAnswers, newlyAnsweredIndices, currentBatch, currentStep, vocabManager) => {
  // Enhanced error handling with fallback
  if (!currentBatch || !currentBatch.length) {
    console.error('No batch available for grading. Current batch:', currentBatch)
    return "⚠️ Error: No exercise batch is currently available. Please try starting a new step with 'Next Step' command."
  }
  
  if (!allAnswers || Object.keys(allAnswers).length === 0) {
    return "Please provide your answers in the format:\n1. answer1\n2. answer2\n..."
  }
  
  const stepName = `Step ${currentStep}`
  let feedback = `**[Step ${currentStep} | Batch 1 | Grading Partial Response]**\n\n`
  
  // Count total answered and remaining
  const totalAnswered = Object.keys(allAnswers).length
  const remaining = currentBatch.length - totalAnswered
  
  // Show feedback only for newly answered items in this round
  const newlyAnsweredItems = []
  newlyAnsweredIndices.forEach(index => {
    const exercise = currentBatch[index]
    const userAnswer = allAnswers[index]
    if (exercise && userAnswer) {
      newlyAnsweredItems.push({ exercise, index, userAnswer })
    }
  })
  
  if (newlyAnsweredItems.length > 0) {
    feedback += `**Feedback for this round:**\n\n`
    
    newlyAnsweredItems.forEach(({ exercise, index, userAnswer }) => {
      // Use new validation service instead of vocabManager.validateAnswer
      const isCorrect = validationService.validateAnswer(userAnswer, exercise.answer, exercise.type, exercise)
      const prompt = getExercisePrompt(exercise)
      
      if (isCorrect) {
        feedback += `${index + 1}. ${prompt}: Your answer: ${userAnswer} ✅\n`
      } else {
        const helpQuery = encodeURIComponent(`Why is "${userAnswer}" wrong for "${prompt}" in German?`)
        const correctDisplay = Array.isArray(exercise.answer) 
          ? exercise.answer.join(' or ') 
          : exercise.answer
        feedback += `${index + 1}. ${prompt}: Your answer: ${userAnswer} Correction: ${correctDisplay} 💡\n`
      }
    })
    
    feedback += `\n`
  }
  
  // Display summary of all answers received so far
  const answeredItems = Object.keys(allAnswers).map(index => ([
    parseInt(index),
    currentBatch[parseInt(index)],
    allAnswers[index]
  ])).filter(([index]) => index !== null && index !== undefined && currentBatch[parseInt(index)]).sort((a, b) => a[0] - b[0]);
  
  if (answeredItems.length > 0) {
    feedback += `All answers submitted so far (${answeredItems.length}/${currentBatch.length})\n`
    answeredItems.forEach(([index, exercise, answer]) => {
      const isCorrect = validationService.validateAnswer(answer, exercise.answer, exercise.type, exercise)
      const prompt = getExercisePrompt(exercise)
      
      if (isCorrect) {
        feedback += `${index + 1}. ${prompt}: ${answer} ✅\n`
      } else {
        const helpQuery = encodeURIComponent(`Why is "${answer}" wrong for "${prompt}" in German?`)
        const correctDisplay = Array.isArray(exercise.answer) 
          ? exercise.answer.join(' or ') 
          : exercise.answer
        feedback += `${index + 1}. ${prompt}: ${answer} ❌ Correction: ${correctDisplay} 💡\n`
      }
    });
    feedback += `\n***\n\n`
  }
  
  // Check if all items have been answered
  if (remaining === 0) {
    feedback += generateBatchCompleteFeedback(totalAnswered, currentStep)
  } else {
    feedback += generateBatchIncompleteFeedback(currentBatch, allAnswers, remaining, currentStep)
  }
  
  return feedback
}

/**
 * Generate feedback for completed batch
 * @param {number} totalAnswered - Total answered items
 * @param {number} currentStep - Current step number
 * @returns {string} Completion feedback
 */
const generateBatchCompleteFeedback = (totalAnswered, currentStep) => {
  let feedback = `🎉 **Step ${currentStep} Complete!** All ${totalAnswered} items have been answered.\n\n`
  feedback += `**Progress Summary:**\n`
  feedback += `- **Items Processed:** ${totalAnswered}\n`
  feedback += `- **Remaining:** 0\n\n`
  
  let nextStepInfo = ""
  if (currentStep < 7) {
    nextStepInfo = `Moving to **Step ${currentStep + 1}**...`
  } else {
    nextStepInfo = `Moving to **Daily Recap**...`
  }
  
  feedback += `${nextStepInfo}\n\n`
  feedback += `Type **"Next Step"** to continue or wait for automatic progression.`
  
  return feedback
}

/**
 * Generate feedback for incomplete batch
 * @param {Array} currentBatch - Current batch of exercises
 * @param {Object} allAnswers - All batch answers
 * @param {number} remaining - Number of remaining items
 * @param {number} currentStep - Current step number
 * @returns {string} Incomplete batch feedback
 */
const generateBatchIncompleteFeedback = (currentBatch, allAnswers, remaining, currentStep) => {
  let feedback = `**[Step ${currentStep} | Batch 1 | Remaining: ${remaining}]**\n\n`
  feedback += `Please continue with the remaining items:\n\n`
  
  // List remaining items (only unanswered ones) with original numbering
  currentBatch.forEach((exercise, actualIndex) => {
    if (!allAnswers[actualIndex]) {
      const prompt = getExercisePrompt(exercise)
      feedback += `*${actualIndex + 1}.* ${prompt}\n`
    }
  })
  
  return feedback
}

/**
 * Generate help link for incorrect answers
 * @param {string} userAnswer - User's incorrect answer
 * @param {string} prompt - Exercise prompt
 * @returns {string} Help link HTML
 */
export const generateHelpLink = (userAnswer, prompt) => {
  const helpQuery = encodeURIComponent(`Why is "${userAnswer}" wrong for "${prompt}" in German?`)
  return `<a href="https://chatgpt.com/?q=${helpQuery}" target="_blank" rel="noopener noreferrer" title="Ask ChatGPT for explanation">💡</a>`
}

/**
 * Format correct answer for display
 * @param {string|Array} answer - Correct answer(s)
 * @returns {string} Formatted answer string
 */
export const formatCorrectAnswer = (answer) => {
  return Array.isArray(answer) 
    ? answer.join(' or ') 
    : answer
}

/**
 * Generate answer validation error message
 * @param {string} reason - Reason for validation error
 * @returns {string} Error message
 */
export const generateValidationError = (reason) => {
  const messages = {
    'empty': "Please provide your answers in the format:\n1. answer1\n2. answer2\n...",
    'invalid_format': "⚠️ Error: Invalid answer format. Please provide answers one per line or numbered (e.g., '1. answer').",
    'mixed_format': "⚠️ Error: Please provide either all numbered answers (e.g., '1. answer') or all sequential answers (one per line). Mixed formats are not supported.",
    'no_batch': "⚠️ Error: No exercise batch is currently available. Please try starting a new step with 'Next Step' command.",
    'default': "Please provide your answers in the format:\n1. answer1\n2. answer2\n..."
  }
  
  return messages[reason] || messages.default
}
