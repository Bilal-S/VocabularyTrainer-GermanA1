import { 
  getRandomLetters, 
  getNounsFromLetters, 
  getVerbsFromLetters, 
  getExamplesByTypeAndLetters,
  initializeVocabularyPools,
  getVocabularyByLetter
} from '../data/vocabulary/index.js'

export class VocabularyManager {
  constructor() {
    this.currentBatch = []
    this.currentBatchIndex = 0
    this.currentLetters = getRandomLetters(3) // Use 3 random letters for variety
    this.excludeList = []
  }

  // Generate Step 1: Review Previous Mistakes
  generateReviewBatch(reviewQueue, batchSize = 10) {
    if (!reviewQueue || reviewQueue.length === 0) {
      console.warn('No review queue items available')
      return []
    }

    // Get random letters for review variety
    const reviewLetters = getRandomLetters(2)
    
    // Find matching words from our letters
    const reviewItems = reviewQueue.map(item => {
      const { word, section } = item
      const letterData = this.findWordInLetters(word, reviewLetters)
      
      if (letterData) {
        if (letterData.type === 'noun') {
          return {
            type: 'noun',
            question: `What is German word for "${letterData.english}"?`,
            answer: letterData.german,
            word: letterData.german,
            english: letterData.english,
            gender: letterData.gender,
            article: letterData.article,
            originSection: section || 'Unknown'
          }
        } else if (letterData.type === 'verb') {
          return {
            type: 'verb',
            question: `What is German word for "${letterData.english}"?`,
            answer: letterData.german,
            word: letterData.german,
            english: letterData.english,
            originSection: section || 'Unknown'
          }
        }
      }
      return null
    }).filter(Boolean)

    this.currentBatch = reviewItems.slice(0, batchSize)
    this.currentBatchIndex = 0
    
    return this.currentBatch
  }

  // Generate Step 2: New Vocabulary (20 nouns)
  generateVocabularyBatch(exclude = [], batchSize = 20) {
    console.log('Generating vocabulary batch with:', { exclude: exclude.slice(0, 5), batchSize })
    
    // Try with increasing number of letters until we get enough nouns
    let letters = getRandomLetters(4) // Use 4 letters for variety
    let nouns = getNounsFromLetters(letters, batchSize, [...exclude, ...this.excludeList])
    
    // Fallback: try with more letters if we don't have enough
    if (!nouns || nouns.length < batchSize) {
      console.warn(`Insufficient nouns with ${letters.length} letters, trying with all available letters`)
      letters = getRandomLetters(10) // Try all available letters
      nouns = getNounsFromLetters(letters, batchSize, [...exclude, ...this.excludeList])
    }
    
    // Final fallback: use available letters without randomization
    if (!nouns || nouns.length === 0) {
      console.error('No nouns available even with all letters, checking vocabulary database')
      const availableLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
      nouns = getNounsFromLetters(availableLetters, batchSize, [...exclude, ...this.excludeList])
    }
    
    if (!nouns || nouns.length === 0) {
      console.error('Vocabulary generation failed completely')
      return []
    }

    // Ensure we have proper noun structure
    const validNouns = nouns.filter(noun => 
      noun && 
      noun.german && 
      noun.english && 
      noun.article
    )

    if (validNouns.length === 0) {
      console.error('No valid nouns found in generated batch')
      return []
    }

    this.currentBatch = validNouns.map(noun => ({
      type: 'vocabulary',
      question: `Provide German translation for "${noun.english}" (include article)`,
      answer: noun.german,
      word: noun.german,
      english: noun.english,
      gender: noun.gender,
      article: noun.article,
      plural: noun.plural
    }))

    this.currentBatchIndex = 0
    this.addToExcludeList(validNouns.map(n => n.german))
    
    console.log('Generated vocabulary batch:', {
      batchSize: this.currentBatch.length,
      firstItem: this.currentBatch[0],
      letters: letters.join(',')
    })
    
    return this.currentBatch
  }

  // Generate Step 3: Plural Practice (20 nouns)
  generatePluralBatch(exclude = [], batchSize = 20) {
    const letters = getRandomLetters(4) // Use 4 letters for variety
    const nouns = getNounsFromLetters(letters, batchSize, [...exclude, ...this.excludeList])
    
    if (!nouns || nouns.length === 0) {
      console.error('No nouns available for plural batch')
      return []
    }

    this.currentBatch = nouns.map(noun => ({
      type: 'plural',
      question: `What is plural form of "${noun.german}"?`,
      answer: noun.plural,
      word: noun.german,
      singular: noun.german,
      plural: noun.plural,
      english: noun.english,
      article: noun.pluralArticle
    }))

    this.currentBatchIndex = 0
    this.addToExcludeList(nouns.map(n => n.german))
    return this.currentBatch
  }

  // Generate Step 4: Articles in Context (30 sentences: 10 each case)
  generateArticlesBatch() {
    const letters = getRandomLetters(3) // Use 3 letters for variety
    const nominative = getExamplesByTypeAndLetters('nominative', letters, 10)
    const accusative = getExamplesByTypeAndLetters('accusative', letters, 10)
    const dative = getExamplesByTypeAndLetters('dative', letters, 10)
    
    if (!nominative || !accusative || !dative) {
      console.error('No examples available for articles batch')
      return []
    }

    this.currentBatch = [
      ...nominative.map(s => ({ ...s, type: 'article', caseType: 'nominative' })),
      ...accusative.map(s => ({ ...s, type: 'article', caseType: 'accusative' })),
      ...dative.map(s => ({ ...s, type: 'article', caseType: 'dative' }))
    ]

    this.currentBatchIndex = 0
    return this.currentBatch
  }

  // Generate Step 5: Case Translations (30 sentences: 10 each case)
  generateTranslationBatch() {
    const letters = getRandomLetters(3) // Use 3 letters for variety
    const translations = getExamplesByTypeAndLetters('translations', letters, 30)
    
    if (!translations || translations.length === 0) {
      console.error('No translations available for translation batch')
      return []
    }

    this.currentBatch = translations.map(t => ({
      ...t,
      answer: t.german, // Ensure answer property exists
      type: 'translation'
    }))

    this.currentBatchIndex = 0
    return this.currentBatch
  }

  // Generate Step 6: Verb Conjugation (3 rounds of 10 items)
  generateVerbBatch(exclude = [], batchSize = 10) {
    const letters = getRandomLetters(2) // Use 2 letters for variety
    const verbs = getVerbsFromLetters(letters, Math.ceil(batchSize / 2), [...exclude, ...this.excludeList])
    
    if (!verbs || verbs.length === 0) {
      console.error('No verbs available for conjugation batch')
      return []
    }

    // Use explicit subjects to distinguish between singular "she" and plural "they"
    const subjects = ['ich', 'du', 'er', 'sie (she)', 'es', 'wir', 'ihr', 'sie (they)', 'Sie']
    
    this.currentBatch = []
    for (let i = 0; i < batchSize; i++) {
      const verb = verbs[i % verbs.length]
      const subject = subjects[i % subjects.length]
      
      this.currentBatch.push({
        type: 'conjugation',
        question: `How do you conjugate "${verb.english}" for "${subject}"?`,
        answer: verb.conjugations[subject],
        verb: verb.german,
        verbEnglish: verb.english,
        subject: subject,
        conjugation: verb.conjugations[subject]
      })
    }

    this.currentBatchIndex = 0
    this.addToExcludeList(verbs.map(v => v.german))
    return this.currentBatch
  }

  // Helper methods
  getLetterData(letter) {
    // Use the actual alphabet-based vocabulary data
    return getVocabularyByLetter(letter)
  }

  findWordInLetters(word, letters) {
    for (const letter of letters) {
      const letterData = this.getLetterData(letter)
      if (letterData) {
        const noun = (letterData.nouns || []).find(n => n.german === word)
        if (noun) return { ...noun, type: 'noun' }
        
        const verb = (letterData.verbs || []).find(v => v.german === word)
        if (verb) return { ...verb, type: 'verb' }
      }
    }
    return null
  }

  addToExcludeList(words) {
    this.excludeList = [...new Set([...this.excludeList, ...words])]
  }

  getCurrentItem() {
    return this.currentBatch[this.currentBatchIndex] || null
  }

  moveToNext() {
    this.currentBatchIndex++
    return this.getCurrentItem()
  }

  getBatchProgress() {
    return {
      current: this.currentBatchIndex + 1,
      total: this.currentBatch.length,
      remaining: this.currentBatch.length - this.currentBatchIndex - 1,
      isComplete: this.currentBatchIndex >= this.currentBatch.length - 1
    }
  }

  resetBatch() {
    this.currentBatch = []
    this.currentBatchIndex = 0
  }

  // Validate user answers
  validateAnswer(userAnswer, correctAnswer, type) {
    if (userAnswer === undefined || userAnswer === null || correctAnswer === undefined || correctAnswer === null) {
      console.warn('validateAnswer called with missing arguments', { userAnswer, correctAnswer, type })
      return false
    }

    const normalizedUser = String(userAnswer).trim().toLowerCase()
    const normalizedCorrect = String(correctAnswer).trim().toLowerCase()

    switch (type) {
      case 'noun':
      case 'verb':
      case 'plural':
      case 'conjugation':
        return normalizedUser === normalizedCorrect
      
      case 'article':
        // Accept multiple valid articles
        const validArticles = ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'eines']
        return validArticles.includes(normalizedUser) && normalizedUser === normalizedCorrect
      
      case 'translation':
        // More flexible checking for translations
        return this.fuzzyMatch(normalizedUser, normalizedCorrect)
      
      default:
        return normalizedUser === normalizedCorrect
    }
  }

  fuzzyMatch(answer, correct) {
    // Simple fuzzy matching for translations
    const answerWords = answer.split(' ')
    const correctWords = correct.split(' ')
    
    if (answerWords.length !== correctWords.length) return false
    
    let matches = 0
    for (let i = 0; i < answerWords.length; i++) {
      if (answerWords[i] === correctWords[i] || 
          this.levenshteinDistance(answerWords[i], correctWords[i]) <= 1) {
        matches++
      }
    }
    
    return matches === correctWords.length
  }

  levenshteinDistance(str1, str2) {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}

export default VocabularyManager
