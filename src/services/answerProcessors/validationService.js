import { 
  getAllNounsFromAllLetters,
  getAllVerbsFromAllLetters
} from '../../data/vocabulary/index.js'

/**
 * Enhanced validation service with proper synonym support
 */
export class ValidationService {
  constructor() {
    this.nounCache = null
    this.verbCache = null
  }

  // Cache all nouns and verbs for efficient lookup
  initializeCache() {
    if (!this.nounCache) {
      this.nounCache = getAllNounsFromAllLetters()
      this.verbCache = getAllVerbsFromAllLetters()
    }
  }

  // CRITICAL FIX: Add umlaut substitution helper
  normalizeUmlauts(text) {
    if (!text) return ''
    return text
      .replace(/ue/g, 'ü')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/Ue/g, 'Ü')
      .replace(/Oe/g, 'Ö')
      .replace(/Ae/g, 'Ä')
      .replace(/sss/g, 'ß')
  }

  // Enhanced synonym lookup that finds ALL German words for an English word
  getSynonyms(englishWord) {
    if (!englishWord) return []
    
    this.initializeCache()
    
    // Find all nouns with the same English word (case-insensitive)
    const synonyms = this.nounCache.filter(noun => 
      noun.english && noun.english.toLowerCase() === englishWord.toLowerCase()
    )
    
    console.log(`Found ${synonyms.length} synonyms for "${englishWord}":`, synonyms.map(s => s.german))
    return synonyms
  }

  // Enhanced validation with proper synonym support
  validateAnswer(userAnswer, correctAnswer, type, exercise = null) {
    if (userAnswer === undefined || userAnswer === null || correctAnswer === undefined || correctAnswer === null) {
      console.warn('validateAnswer called with missing arguments', { userAnswer, correctAnswer, type })
      return false
    }
  
    // Normalize umlauts for ALL input
    const normalizedUser = this.normalizeUmlauts(String(userAnswer).trim())
  
    const normalizeCorrect = (val) =>
      Array.isArray(val)
        ? val.map((v) => this.normalizeUmlauts(String(v).trim()))
        : this.normalizeUmlauts(String(val).trim())
  
    const normalizedCorrect = normalizeCorrect(correctAnswer)
  
    console.log('Validating answer:', { userAnswer: normalizedUser, correctAnswer: normalizedCorrect, type })
  
    switch (type) {
      case 'noun':
      case 'verb':
      case 'plural':
      case 'article':
        return this.validateGermanAnswer(normalizedUser, normalizedCorrect, type, exercise)
  
      case 'conjugation':
        return this.validateConjugationAnswer(normalizedUser, normalizedCorrect, exercise)
  
      case 'translation':
        return this.validateTranslationAnswer(normalizedUser, normalizedCorrect)
  
      default:
        return this.caseSensitiveMatch(normalizedUser, normalizedCorrect)
    }
  }

  // Enhanced German answer validation with synonym support
  validateGermanAnswer(normalizedUser, normalizedCorrect, type, exercise = null) {
    // Check exact match first
    if (Array.isArray(normalizedCorrect)) {
      if (normalizedCorrect.some(ans => this.caseSensitiveMatch(normalizedUser, ans))) {
        return true
      }
    } else {
      if (this.caseSensitiveMatch(normalizedUser, normalizedCorrect)) {
        return true
      }
    }

    // For nouns, check synonyms
    if ((type === 'noun' || type === 'vocabulary') && exercise && exercise.english) {
      console.log('Checking synonyms for:', exercise.english)
      
      // Get all German words that translate to the same English word
      const synonyms = this.getSynonyms(exercise.english)
      
      // Check if user's answer matches any synonym
      for (const synonym of synonyms) {
        const normalizedSynonym = this.normalizeUmlauts(synonym.german)
        console.log(`Checking synonym: "${normalizedSynonym}" against user answer: "${normalizedUser}"`)
        
        if (this.caseSensitiveMatch(normalizedUser, normalizedSynonym)) {
          console.log(`✅ Found synonym match: "${normalizedUser}" matches "${normalizedSynonym}"`)
          return true
        }
      }

      // Special case: Check if user's answer and the "correct" answer are synonyms
      // This handles cases where the system expects one synonym but user provides another
      if (Array.isArray(normalizedCorrect)) {
        for (const correct of normalizedCorrect) {
          if (this.areSynonyms(normalizedUser, correct, exercise.english)) {
            console.log(`✅ Cross-synonym match: "${normalizedUser}" and "${correct}" are both valid for "${exercise.english}"`)
            return true
          }
        }
      } else {
        if (this.areSynonyms(normalizedUser, normalizedCorrect, exercise.english)) {
          console.log(`✅ Cross-synonym match: "${normalizedUser}" and "${normalizedCorrect}" are both valid for "${exercise.english}"`)
          return true
        }
      }
    }
    
    return false
  }

  // Check if two German words are synonyms (same English meaning)
  areSynonyms(germanWord1, germanWord2, englishWord) {
    if (!englishWord) return false
    
    // Get all nouns with the same English word
    const synonyms = this.getSynonyms(englishWord)
    
    // Normalize both words for comparison
    const normalizedWord1 = this.normalizeUmlauts(germanWord1).toLowerCase()
    const normalizedWord2 = this.normalizeUmlauts(germanWord2).toLowerCase()
    
    // Check if both words appear in the synonyms list
    const foundWord1 = synonyms.some(syn => 
      this.normalizeUmlauts(syn.german).toLowerCase() === normalizedWord1
    )
    const foundWord2 = synonyms.some(syn => 
      this.normalizeUmlauts(syn.german).toLowerCase() === normalizedWord2
    )
    
    console.log(`Synonym check: "${germanWord1}" (${foundWord1 ? 'found' : 'not found'}) vs "${germanWord2}" (${foundWord2 ? 'found' : 'not found'}) for "${englishWord}"`)
    
    // If both words are found in synonyms list, they are synonyms
    return foundWord1 && foundWord2
  }

  // Validate conjugation answers
  validateConjugationAnswer(normalizedUser, normalizedCorrect, exercise = null) {
    const correctAnswers = Array.isArray(normalizedCorrect) ? normalizedCorrect : [normalizedCorrect]
  
    for (const correct of correctAnswers) {
      const userParts = normalizedUser.split(' ')
      const correctParts = correct.split(' ')
  
      if (userParts.length === 2 && correctParts.length === 2) {
        const [userSubject, userVerb] = userParts
        const [correctSubject, correctVerb] = correctParts
  
        // Use clean subject comparison if available
        let cleanCorrectSubject = correctSubject
        if (exercise && exercise.cleanSubject) {
          cleanCorrectSubject = exercise.cleanSubject
        }
  
        const subjectMatch = userSubject.toLowerCase() === cleanCorrectSubject.toLowerCase()
        const verbMatch = userVerb === correctVerb
  
        if (subjectMatch && verbMatch) return true
      }
    }
  
    return false
  }

  // Validate translation answers
  validateTranslationAnswer(normalizedUser, normalizedCorrect) {
    if (Array.isArray(normalizedCorrect)) {
      return normalizedCorrect.some(ans => this.fuzzyMatch(normalizedUser, ans))
    }
    return this.fuzzyMatch(normalizedUser, normalizedCorrect)
  }

  // Case-sensitive matching for German words
  caseSensitiveMatch(answer, correct) {
    const answerWords = answer.split(' ').filter(Boolean)
    const correctWords = correct.split(' ').filter(Boolean)
  
    if (answerWords.length !== correctWords.length) {
      return false
    }
  
    for (let i = 0; i < correctWords.length; i++) {
      if (answerWords[i] !== correctWords[i]) {
        // Allow case variations for articles
        const isArticle = /^(der|die|das|den|dem|des|ein|eine|einen|einem|eines)$/i.test(correctWords[i])
        if (isArticle && answerWords[i].toLowerCase() === correctWords[i].toLowerCase()) {
          continue
        }
        return false
      }
    }
  
    return true
  }

  // Fuzzy matching with typo tolerance
  fuzzyMatch(answer, correct) {
    const answerWords = answer.split(' ').filter(Boolean)
    const correctWords = correct.split(' ').filter(Boolean)
  
    if (answerWords.length !== correctWords.length) {
      return false
    }
  
    let matches = 0
    for (let i = 0; i < correctWords.length; i++) {
      const answerWord = answerWords[i]
      const correctWord = correctWords[i]
  
      if (answerWord === correctWord) {
        matches++
      } else if (answerWord.toLowerCase() === correctWord.toLowerCase()) {
        const isSimpleWord = /^(der|die|das|den|dem|des|ein|eine|einen|einem|eines|und|oder|aber|in|an|auf|unter|über|mit|zu|bei|von|nach|vor|für|durch|gegen|ohne|während|bis|seit|wegen)$/i.test(correctWord.toLowerCase())
        if (isSimpleWord) {
          matches++
        } else if (this.levenshteinDistance(answerWord.toLowerCase(), correctWord.toLowerCase()) <= 1) {
          matches++
        }
      } else if (this.levenshteinDistance(answerWord.toLowerCase(), correctWord.toLowerCase()) <= 1) {
        matches++
      }
    }
  
    return matches === correctWords.length
  }

  // Levenshtein distance for typo tolerance
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

// Export singleton instance
export const validationService = new ValidationService()
