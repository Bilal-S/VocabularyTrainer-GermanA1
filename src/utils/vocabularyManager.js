import { 
  getRandomLetters, 
  getNounsFromLetters, 
  getVerbsFromLetters, 
  getExamplesByTypeAndLetters,
  initializeVocabularyPools,
  getVocabularyByLetter,
  getAvailableLetters
} from '../data/vocabulary/index.js'

export class VocabularyManager {
  constructor() {
    this.currentBatch = []
    this.currentBatchIndex = 0
    this.currentLetters = getRandomLetters(3) // Use 3 random letters for variety
    this.excludeList = []
  }

  // CRITICAL FIX: Add umlaut substitution helper
  normalizeUmlauts(text) {
    return text
      .replace(/ue/g, 'ü')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/Ue/g, 'Ü')
      .replace(/Oe/g, 'Ö')
      .replace(/Ae/g, 'Ä')
  }

  // Generate Step 1: Review Previous Mistakes
  generateReviewBatch(reviewQueue, batchSize = 10) {
    if (!reviewQueue || reviewQueue.length === 0) {
      console.warn('No review queue items available')
      return []
    }

    // Use all available letters to search for review items
    const allLetters = getAvailableLetters()
    
    // Find matching words from all letters with section-aware question generation
    const reviewItems = reviewQueue.map(item => {
      const itemWord = typeof item === 'string' ? item : item.word
      const section = typeof item === 'string' ? 'Unknown' : item.section
      
      const letterData = this.findWordInLetters(itemWord, allLetters)
      
      if (letterData) {
        // CRITICAL FIX: Generate section-aware review questions based on original mistake
        switch (section) {
          case 'PLURAL':
            if (letterData.type === 'noun') {
              // Use raw word without article for the question, but full plural with article for answer
              const displayWord = letterData.word || letterData.german.split(' ').pop()
              return {
                type: 'plural',
                form: 'plural', // Track that this is plural form review
                question: `What is plural form of "${displayWord}"?`,
                answer: letterData.plural,
                word: displayWord,
                singular: letterData.german,
                plural: letterData.plural,
                english: letterData.english,
                article: letterData.pluralArticle,
                originSection: section
              }
            }
            break
            
          case 'VERBS':
            if (letterData.type === 'verb') {
              // Pick a random subject for verb conjugation review
              const subjects = ['ich', 'du', 'er', 'sie (she)', 'es', 'wir', 'ihr', 'sie (they)', 'Sie']
              const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
              const conjugation = letterData.conjugations[randomSubject]
              
              return {
                type: 'conjugation',
                question: `Conjugate "${letterData.english}" for "${randomSubject}" (e.g., "ich bin"):`,
                answer: `${randomSubject} ${conjugation}`,
                verb: letterData.german,
                verbEnglish: letterData.english,
                subject: randomSubject,
                conjugation: conjugation,
                word: letterData.german,
                originSection: section
              }
            }
            break
            
          case 'ARTICLES':
            // Generate article context question using existing examples
            const articleExamples = getExamplesByTypeAndLetters('articles', getRandomLetters(2), 1)
            if (articleExamples && articleExamples.length > 0) {
              const example = articleExamples[0]
              return {
                type: 'article',
                question: `Fill in the blank: ${example.german.replace('___', '_____')}`,
                answer: example.answer || example.german.match(/___\s*(\w+)/)?.[1] || example.answer,
                german: example.german,
                english: example.english,
                caseType: example.caseType || 'nominative',
                originSection: section
              }
            }
            break
            
          case 'TRANSLATIONS':
            // Generate translation question using existing examples
            const translationExamples = getExamplesByTypeAndLetters('translations', getRandomLetters(2), 1)
            if (translationExamples && translationExamples.length > 0) {
              const example = translationExamples[0]
              return {
                type: 'translation',
                question: `Translate to German: "${example.english}"`,
                answer: example.german,
                german: example.german,
                english: example.english,
                caseType: example.caseType || 'nominative',
                originSection: section
              }
            }
            break
            
          case 'VOCABULARY':
          default:
            // Default: vocabulary translation question
            if (letterData.type === 'noun') {
              return {
                type: 'noun',
                form: 'singular', // Track that this is singular form review
                question: `What is German word for "${letterData.english}"?`,
                answer: letterData.german,
                word: letterData.german,
                english: letterData.english,
                gender: letterData.gender,
                article: letterData.article,
                originSection: section
              }
            } else if (letterData.type === 'verb') {
              return {
                type: 'verb',
                question: `What is German word for "${letterData.english}"?`,
                answer: letterData.german,
                word: letterData.german,
                english: letterData.english,
                originSection: section
              }
            }
            break
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
      form: 'singular', // Track that this is singular form practice
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
      form: 'plural', // Track that this is plural form practice
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
      const conjugation = verb.conjugations[subject]
      
      this.currentBatch.push({
        type: 'conjugation',
        question: `Conjugate "${verb.english}" for "${subject}" (e.g., "ich bin"):`,
        answer: `${subject} ${conjugation}`, // Expect full "subject + verb" format
        verb: verb.german,
        verbEnglish: verb.english,
        subject: subject,
        conjugation: conjugation,
        word: verb.german // For progress tracking
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
        // CRITICAL FIX: Search both full german field and raw word field
        const noun = (letterData.nouns || []).find(n => 
          n.german === word || n.word === word
        )
        if (noun) return { ...noun, type: 'noun' }
        
        const verb = (letterData.verbs || []).find(v => 
          v.german === word || v.word === word
        )
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

  // CRITICAL FIX: Implement case-sensitive validation for German answers
  validateAnswer(userAnswer, correctAnswer, type) {
    if (userAnswer === undefined || userAnswer === null || correctAnswer === undefined || correctAnswer === null) {
      console.warn('validateAnswer called with missing arguments', { userAnswer, correctAnswer, type })
      return false
    }

    // Use case-sensitive comparison for German answers
    const normalizedUser = String(userAnswer).trim()
    const normalizedCorrect = String(correctAnswer).trim()

    console.log('Validating answer:', { userAnswer: normalizedUser, correctAnswer: normalizedCorrect, type })

    switch (type) {
      case 'noun':
      case 'verb':
      case 'plural':
        // Case-sensitive comparison for German words
        return this.caseSensitiveMatch(normalizedUser, normalizedCorrect)
      
      case 'conjugation':
        // Special handling for conjugation - expect "subject + verb" format
        return this.validateConjugationAnswer(normalizedUser, normalizedCorrect)
      
      case 'article':
        // Case-sensitive for German articles but allow case variations
        const validArticles = ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'eines']
        return validArticles.includes(normalizedUser.toLowerCase()) && this.caseSensitiveMatch(normalizedUser, normalizedCorrect)
      
      case 'translation':
        // Case-sensitive for German translations with some flexibility
        return this.fuzzyMatch(normalizedUser, normalizedCorrect)
      
      default:
        return this.caseSensitiveMatch(normalizedUser, normalizedCorrect)
    }
  }

  // CRITICAL FIX: Case-sensitive matching for German answers
  caseSensitiveMatch(answer, correct) {
    // Exact match first (preserves case)
    if (answer === correct) {
      return true
    }
    
    // For German nouns and proper nouns, case matters
    // Allow case-insensitive comparison only for simple articles, prepositions, etc.
    const isSimpleWord = /^(der|die|das|den|dem|des|ein|eine|einen|einem|eines|und|oder|aber|in|an|auf|unter|über|mit|zu|bei|von|nach|vor|für|durch|gegen|ohne|während|bis|seit|wegen)$/.test(correct.toLowerCase())
    
    if (isSimpleWord) {
      return answer.toLowerCase() === correct.toLowerCase()
    }
    
    // For compound words and nouns, check case-sensitive
    // Allow minor case differences in articles at beginning
    if (answer.length > 3 && correct.length > 3) {
      // Check if difference is just in the first word (article case)
      const answerWords = answer.split(' ')
      const correctWords = correct.split(' ')
      
      if (answerWords.length === correctWords.length) {
        for (let i = 0; i < answerWords.length; i++) {
          if (i === 0 && answerWords[i].toLowerCase() === correctWords[i].toLowerCase()) {
            // First word is a case variation of article - allow
            continue
          }
          if (answerWords[i] !== correctWords[i]) {
            return false
          }
        }
        return true
      }
    }
    
    return false
  }

  // CRITICAL FIX: Enhanced conjugation answer validation with umlaut support
  validateConjugationAnswer(userAnswer, correctAnswer) {
    // Apply umlaut normalization to user input
    const normalizedUser = this.normalizeUmlauts(userAnswer)
    const normalizedCorrect = this.normalizeUmlauts(correctAnswer)
    
    console.log('Conjugation validation details:', { 
      originalUser: userAnswer, 
      normalizedUser, 
      originalCorrect: correctAnswer, 
      normalizedCorrect 
    })

    // Parse user input to separate subject and verb
    const userParts = normalizedUser.split(' ')
    const correctParts = normalizedCorrect.split(' ')
    
    if (userParts.length !== 2 || correctParts.length !== 2) {
      console.log('Invalid conjugation format - wrong number of parts')
      return false
    }
    
    const [userSubject, userVerb] = userParts
    const [correctSubject, correctVerb] = correctParts
    
    // Check both subject and verb match (case-sensitive for verb, case-insensitive for subject)
    const subjectMatch = userSubject.toLowerCase() === correctSubject.toLowerCase()
    const verbMatch = userVerb === correctVerb
    
    console.log('Conjugation match result:', { 
      subjectMatch, 
      verbMatch, 
      userSubject, 
      correctSubject,
      userVerb, 
      correctVerb 
    })
    
    return subjectMatch && verbMatch
  }

  fuzzyMatch(answer, correct) {
    // Simple fuzzy matching for translations with case sensitivity
    const answerWords = answer.split(' ')
    const correctWords = correct.split(' ')
    
    if (answerWords.length !== correctWords.length) return false
    
    let matches = 0
    for (let i = 0; i < answerWords.length; i++) {
      const answerWord = answerWords[i]
      const correctWord = correctWords[i]
      
      // Try exact match first (case-sensitive)
      if (answerWord === correctWord) {
        matches++
      } else if (answerWord.toLowerCase() === correctWord.toLowerCase()) {
        // Allow case-insensitive for simple words
        const isSimpleWord = /^(der|die|das|den|dem|des|ein|eine|einen|einem|eines|und|oder|aber|in|an|auf|unter|über|mit|zu|bei|von|nach|vor|für|durch|gegen|ohne|während|bis|seit|wegen)$/.test(correctWord.toLowerCase())
        if (isSimpleWord) {
          matches++
        } else if (this.levenshteinDistance(answerWord.toLowerCase(), correctWord.toLowerCase()) <= 1) {
          // Allow one character difference for more complex words
          matches++
        }
      } else if (this.levenshteinDistance(answerWord.toLowerCase(), correctWord.toLowerCase()) <= 1) {
        // Allow one character difference for typos
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
