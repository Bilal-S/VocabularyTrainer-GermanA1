import { validationService } from './validationService.js'

/**
 * Process single answer and generate feedback
 * @param {string} userAnswer - User's answer
 * @param {Object} currentExercise - Current exercise object
 * @param {Object} vocabManager - VocabularyManager instance
 * @param {Object} progress - Current progress
 * @returns {Object} Feedback and next exercise info
 */
export const processSingleAnswer = (userAnswer, currentExercise, vocabManager, progress) => {
  if (!currentExercise) {
    return {
      error: "Please wait for exercise to load...",
      shouldProceed: false
    }
  }

  // Use new validation service instead of vocabManager.validateAnswer
  const isCorrect = validationService.validateAnswer(userAnswer, currentExercise.answer, currentExercise.type, currentExercise)
  
  // Generate feedback message
  let feedback = `✅ Answer received: "${userAnswer}"\n\n`
  
  if (isCorrect) {
    feedback += `🎉 **Correct!**\n\n`
    feedback += generateCorrectFeedback(currentExercise)
  } else {
    feedback += `❌ **Not quite right.**\n\n`
    feedback += generateIncorrectFeedback(currentExercise, userAnswer)
  }
  
  // Move to next exercise in batch
  const nextExercise = vocabManager.moveToNext()
  const nextQuestionNumber = progress.current + 1
  
  // Show next question or completion message
  if (nextExercise && nextQuestionNumber <= progress.total) {
    feedback += `**Progress:** ${nextQuestionNumber}/${progress.total} questions completed\n\n`
    feedback += `**Question ${nextQuestionNumber} of ${progress.total}: From ${nextExercise?.originSection || 'Unknown'}**\n---\n${nextExercise?.question || 'Loading question...'}\nType your answer below:`
  } else if (nextQuestionNumber >= progress.total) {
    feedback += `**Progress:** ${progress.total}/${progress.total} questions completed\n\n`
    feedback += `✅ Review section complete! Moving to next step...`
  }
  
  return {
    feedback,
    isCorrect,
    nextExercise,
    shouldProceed: progress.isComplete,
    progressUpdate: {
      word: currentExercise.word,
      isCorrect,
      section: currentExercise.originSection,
      form: currentExercise.form || 'singular'
    }
  }
}

/**
 * Generate feedback for correct answers
 * @param {Object} exercise - Exercise object
 * @returns {string} Correct answer feedback
 */
const generateCorrectFeedback = (exercise) => {
  let feedback = ''
  
  if (exercise.type === 'noun' || exercise.type === 'verb') {
    feedback += `**German:** ${exercise.answer}\n`
    feedback += `**English:** ${exercise.english}\n`
    if (exercise.gender) {
      feedback += `**Gender:** ${exercise.gender}\n`
    }
  } else if (exercise.type === 'plural') {
    feedback += `**Singular:** ${exercise.singular}\n`
    feedback += `**Plural:** ${exercise.answer}\n`
    feedback += `**English:** ${exercise.english}\n`
  } else if (exercise.type === 'conjugation') {
    feedback += `**Verb:** ${exercise.verb}\n`
    feedback += `**Subject:** ${exercise.subject}\n`
    feedback += `**Conjugation:** ${exercise.answer}\n`
  } else if (exercise.type === 'article') {
    feedback += `**Correct article:** ${exercise.answer}\n`
    feedback += `**Case:** ${exercise.caseType}\n`
    feedback += `**Sentence:** ${exercise.german.replace('___', exercise.answer)}\n`
  } else if (exercise.type === 'translation') {
    feedback += `**German:** ${exercise.answer}\n`
    feedback += `**English:** ${exercise.english}\n`
    feedback += `**Case:** ${exercise.caseType}\n`
  }
  
  return feedback
}

/**
 * Generate feedback for incorrect answers
 * @param {Object} exercise - Exercise object
 * @param {string} userAnswer - User's incorrect answer
 * @returns {string} Incorrect answer feedback
 */
const generateIncorrectFeedback = (exercise, userAnswer) => {
  let feedback = ''
  
  if (exercise.type === 'noun' || exercise.type === 'verb') {
    feedback += `The correct answer is: **${exercise.answer}**\n`
    feedback += `**English:** ${exercise.english}\n\n`
  } else if (exercise.type === 'plural') {
    feedback += `The correct plural is: **${exercise.answer}**\n`
    feedback += `Singular: ${exercise.singular}\n\n`
  } else if (exercise.type === 'conjugation') {
    feedback += `The correct conjugation is: **${exercise.answer}**\n`
    feedback += `Verb: ${exercise.verb} (${exercise.verbEnglish})\n`
    feedback += `Subject: ${exercise.subject}\n\n`
  } else if (exercise.type === 'article') {
    feedback += `The correct article is: **${exercise.answer}**\n`
    feedback += `Complete sentence: ${exercise.german.replace('___', exercise.answer)}\n\n`
  } else if (exercise.type === 'translation') {
    const answers = Array.isArray(exercise.answer) 
      ? exercise.answer.join('** or **') 
      : exercise.answer
    feedback += `The correct translation is: **${answers}**\n\n`
  }
  
  // Add ChatGPT link for help
  const helpQuery = encodeURIComponent(`Why is "${userAnswer}" wrong for "${exercise.english}" in German?`)
  feedback += `💡 **Need help?** <a href="https://chatgpt.com/?q=${helpQuery}" target="_blank" rel="noopener noreferrer">Ask ChatGPT for explanation</a>\n\n`
  
  return feedback
}

/**
 * Check if single answer is valid
 * @param {string} answer - User's answer
 * @returns {boolean} True if answer is not empty
 */
export const isValidSingleAnswer = (answer) => {
  return answer && typeof answer === 'string' && answer.trim().length > 0
}

/**
 * Get answer validation error message
 * @returns {string} Error message for invalid input
 */
export const getAnswerValidationError = () => {
  return "Please wait for exercise to load..."
}
