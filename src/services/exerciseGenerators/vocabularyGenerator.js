import { 
  getAllNounsFromAllLetters
} from '../../data/vocabulary/index.js'

/**
 * Generate Step 2: New Vocabulary (20 nouns)
 * @param {Array} exclude - List of words to exclude
 * @param {number} batchSize - Number of items to generate (default: 20)
 * @returns {Array} Array of vocabulary exercises
 */
export const generateVocabularyBatch = (exclude = [], batchSize = 20) => {
  console.log('Generating vocabulary batch with TRUE RANDOMIZATION:', { 
    exclude: exclude.slice(0, 5), 
    batchSize 
  })
  
  // CRITICAL FIX: Use ALL nouns from ALL letters for true randomization
  const allNouns = getAllNounsFromAllLetters(exclude)
  
  if (!allNouns || allNouns.length === 0) {
    console.error('No nouns available from vocabulary database')
    return []
  }

  // Take requested batch size from the shuffled all-nouns array
  const selectedNouns = allNouns.slice(0, batchSize)

  // CRITICAL FIX: Add debugging to see letter distribution
  const letterDistribution = {}
  selectedNouns.forEach(noun => {
    // Use full german word (including article) for letter distribution
    const germanWord = noun.german || noun.word || ''
    const firstLetter = germanWord.charAt(0).toLowerCase()
    letterDistribution[firstLetter] = (letterDistribution[firstLetter] || 0) + 1
  })

  console.log('DEBUG: Letter distribution in selected nouns:', letterDistribution)

  // Ensure we have proper noun structure
  const validNouns = selectedNouns.filter(noun => 
    noun && 
    noun.german && 
    noun.english && 
    noun.article
  )

  if (validNouns.length === 0) {
    console.error('No valid nouns found in generated batch')
    return []
  }

  const vocabularyBatch = validNouns.map(noun => ({
    type: 'vocabulary',
    form: 'singular', // Track that this is singular form practice
    question: `Provide German translation for "${noun.english}" (include article)`,
    answer: noun.german,
    word: noun.german,
    english: noun.english,
    gender: noun.gender,
    article: noun.article,
    plural: noun.plural
  }))

  console.log('Generated vocabulary batch with TRUE RANDOMIZATION:', {
    totalAvailable: allNouns.length,
    batchSize: vocabularyBatch.length,
    firstItem: vocabularyBatch[0]
  })
  
  return vocabularyBatch
}

/**
 * Generate vocabulary exercise message
 * @param {Array} batch - Vocabulary batch
 * @param {number} stepNumber - Current step number
 * @returns {string} Exercise message
 */
export const generateVocabularyMessage = (batch, stepNumber = 2) => {
  const instructions = `Please translate the following **English nouns** into **German** (Article + Noun) singular form:`
  const example = `1. house -> das Haus`
  
  let message = `### **Step ${stepNumber}: New Vocabulary (${batch.length} Nouns)**\n`
  message += `**[Step ${stepNumber} | Batch 1 | Remaining: ${batch.length}]**\n\n`
  message += `${instructions}\n*Example: ${example}*\n\n`

  // Number the items sequentially starting from 1
  batch.forEach((item, index) => {
    message += `*${index + 1}.* ${item.english}\n`
  })

  return message
}

/**
 * Get exclude list for vocabulary generation
 * @param {Object} state - Application state
 * @returns {Array} Combined exclude list
 */
export const getVocabularyExcludeList = (state) => {
  const masteredWords = Array.isArray(state.pools.mastered) 
    ? state.pools.mastered 
    : [
        ...(state.pools.mastered.nouns || []),
        ...(state.pools.mastered.verbs || []),
        ...(state.pools.mastered.words || [])
      ]
  
  return [
    ...masteredWords,
    ...state.pools.reviewQueue.map(item => typeof item === 'string' ? item : item.word),
    ...state.pools.unselected // Also exclude words already used in this session
  ]
}

/**
 * Validate vocabulary batch
 * @param {Array} batch - Generated batch
 * @returns {boolean} True if batch is valid
 */
export const validateVocabularyBatch = (batch) => {
  if (!Array.isArray(batch)) return false
  if (batch.length === 0) return false
  
  return batch.every(item => 
    item &&
    typeof item === 'object' &&
    item.type === 'vocabulary' &&
    item.german &&
    item.english &&
    item.article
  )
}
