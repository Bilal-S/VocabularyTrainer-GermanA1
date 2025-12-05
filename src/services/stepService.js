// Step definitions and configurations for the daily routine
export const STEPS = {
  0: 'INTRO',
  1: 'REVIEW',
  2: 'VOCABULARY',
  3: 'PLURAL',
  4: 'ARTICLES',
  5: 'TRANSLATIONS',
  6: 'VERBS',
  7: 'RECAP'
}

export const STEP_CONFIG = {
  INTRO: {
    name: 'Introduction',
    totalItems: 0
  },
  REVIEW: {
    name: 'Review Previous Mistakes',
    totalItems: 10
  },
  VOCABULARY: {
    name: 'New Vocabulary',
    totalItems: 20
  },
  PLURAL: {
    name: 'Plural Practice',
    totalItems: 20
  },
  ARTICLES: {
    name: 'Articles in Context',
    totalItems: 30
  },
  TRANSLATIONS: {
    name: 'Case Translations',
    totalItems: 30
  },
  VERBS: {
    name: 'Verb Conjugation',
    totalItems: 30
  },
  RECAP: {
    name: 'Daily Recap',
    totalItems: 0
  }
}

/**
 * Get the current section name based on step number
 * @param {number} currentStep - Current step number
 * @returns {string} Section name
 */
export const getCurrentSection = (currentStep) => {
  return STEPS[currentStep] || 'INTRO'
}

/**
 * Get step instructions for a given step
 * @param {string} stepKey - Step key (e.g., 'VOCABULARY')
 * @returns {string} Step instructions
 */
export const getStepInstructions = (stepKey) => {
  const instructions = {
    REVIEW: 'Review your previous mistakes. Type the German translations for the English words provided.',
    VOCABULARY: 'Learn 20 new German nouns with their articles. I\'ll show you English words, and you\'ll provide the German translation.',
    PLURAL: 'Practice German noun plurals. I\'ll give you singular nouns, and you\'ll provide the plural forms.',
    ARTICLES: 'Practice German articles in context. Fill in the blanks with the correct articles (der, die, das, ein, eine).',
    TRANSLATIONS: 'Translate sentences from English to German, focusing on correct case usage.',
    VERBS: 'Practice verb conjugation with different subjects.',
    RECAP: 'Review what you\'ve learned today.'
  }
  
  return instructions[stepKey] || ''
}

/**
 * Get step configuration for a given step number
 * @param {number} currentStep - Current step number
 * @returns {Object} Step configuration
 */
export const getStepConfig = (currentStep) => {
  const stepKey = STEPS[currentStep]
  return STEP_CONFIG[stepKey] || STEP_CONFIG.INTRO
}

/**
 * Check if a step has questions (is not INTRO or RECAP)
 * @param {number} currentStep - Current step number
 * @returns {boolean} True if step has questions
 */
export const stepHasQuestions = (currentStep) => {
  return currentStep !== 0 && currentStep !== 7
}

/**
 * Get the next step number
 * @param {number} currentStep - Current step number
 * @returns {number|null} Next step number or null if at the end
 */
export const getNextStep = (currentStep) => {
  return currentStep < 7 ? currentStep + 1 : null
}

/**
 * Check if step is the final step
 * @param {number} currentStep - Current step number
 * @returns {boolean} True if this is the final step
 */
export const isFinalStep = (currentStep) => {
  return currentStep >= 7
}
