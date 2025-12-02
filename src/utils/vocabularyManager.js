import { 
  getRandomLetters, 
  getNounsFromLetters, 
  getVerbsFromLetters, 
  getExamplesByTypeAndLetters,
  getAllNounsFromAllLetters,
  getAllVerbsFromAllLetters,
  getAllExamplesFromAllLetters,
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
  // the sss is for ß replacement as convenient shorthand
  normalizeUmlauts(text) {
    return text
      .replace(/ue/g, 'ü')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/Ue/g, 'Ü')
      .replace(/Oe/g, 'Ö')
      .replace(/Ae/g, 'Ä')
      .replace(/sss/g, 'ß')
  }

  // Helper to find synonyms based on English translation
  getSynonyms(englishWord) {
    if (!englishWord) return []
    // CRITICAL FIX: Use getAllNounsFromAllLetters to find potential synonyms
    const allNouns = getAllNounsFromAllLetters()
    return allNouns.filter(n => n.english.toLowerCase() === englishWord.toLowerCase())
  }

  // Generate Step 1: Review Previous Mistakes
  generateReviewBatch(reviewQueue, batchSize = 10) {
    if (!reviewQueue || reviewQueue.length === 0) {
      console.warn('No review queue items available')
      return []
    }

    console.log('Generating review batch with TRUE RANDOMIZATION:', { 
      queueSize: reviewQueue.length, 
      batchSize 
    })

    // CRITICAL FIX: Shuffle review queue for random order each time
    const shuffledReviewQueue = [...reviewQueue].sort(() => 0.5 - Math.random())

    // Use all available letters to search for review items
    const allLetters = getAvailableLetters()
    
    // Find matching words from all letters with section-aware question generation
    const reviewItems = shuffledReviewQueue.map(item => {
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
              // Use same subject mapping as main verb generation for consistency
              const subjectMapping = {
                'ich': { clean: 'ich', display: 'ich' },
                'du': { clean: 'du', display: 'du' },
                'er': { clean: 'er', display: 'er' },
                'sie (she)': { clean: 'sie', display: 'sie (she)' },
                'es': { clean: 'es', display: 'es' },
                'wir': { clean: 'wir', display: 'wir' },
                'ihr': { clean: 'ihr', display: 'ihr' },
                'sie (they)': { clean: 'sie', display: 'sie (they)' },
                'Sie': { clean: 'Sie', display: 'Sie' }
              }
              
              const cleanSubjects = Object.keys(subjectMapping)
              const randomCleanSubject = cleanSubjects[Math.floor(Math.random() * cleanSubjects.length)]
              const subjectObj = subjectMapping[randomCleanSubject]
              const conjugation = letterData.conjugations[randomCleanSubject]
              
              return {
                type: 'conjugation',
                question: `Conjugate "${letterData.english}" for "${subjectObj.display}" (e.g., "ich bin"):`,
                answer: `${subjectObj.clean} ${conjugation}`,
                verb: letterData.german,
                verbEnglish: letterData.english,
                subject: subjectObj.display, // Keep display subject for reference
                cleanSubject: subjectObj.clean, // Store clean subject for validation
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
                question: `Fill in the blank(s): ${example.german.replace('___', '_____')}`,
                answer: example.answer || example.german.match(/___\s*(\w+)/)?.[1] || example.answer,
              german: example.german,
              english: example.english,
              caseType: example.caseType || example.case || 'nominative',
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
                caseType: example.caseType || example.case || 'nominative',
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
    const combinedExclude = [...exclude, ...this.excludeList]
    console.log('Generating vocabulary batch with TRUE RANDOMIZATION:', { 
      exclude: exclude.slice(0, 5), 
      excludeListSize: this.excludeList.length,
      totalCombinedExclude: combinedExclude.length,
      batchSize 
    })
    
    // CRITICAL FIX: Use ALL nouns from ALL letters for true randomization
    const allNouns = getAllNounsFromAllLetters(combinedExclude)
    
    if (!allNouns || allNouns.length === 0) {
      console.error('No nouns available from vocabulary database')
      return []
    }

    // Take the requested batch size from the shuffled all-nouns array
    const selectedNouns = allNouns.slice(0, batchSize)

    // CRITICAL FIX: Add debugging to see letter distribution
    const letterDistribution = {}
    selectedNouns.forEach(noun => {
      // Use the full german word (including article) for letter distribution
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
    
    console.log('Generated vocabulary batch with TRUE RANDOMIZATION:', {
      totalAvailable: allNouns.length,
      batchSize: this.currentBatch.length,
      firstItem: this.currentBatch[0]
    })
    
    return this.currentBatch
  }

  // Generate Step 3: Plural Practice (20 nouns)
  generatePluralBatch(exclude = [], batchSize = 20) {
    const combinedExclude = [...exclude, ...this.excludeList]
    console.log('Generating plural batch with TRUE RANDOMIZATION:', { 
      exclude: exclude.slice(0, 5), 
      excludeListSize: this.excludeList.length,
      totalCombinedExclude: combinedExclude.length,
      batchSize 
    })
    
    // CRITICAL FIX: Use ALL nouns from ALL letters for true randomization
    const allNouns = getAllNounsFromAllLetters(combinedExclude)
    
    if (!allNouns || allNouns.length === 0) {
      console.error('No nouns available for plural batch')
      console.error('DEBUG: Exclude list might be too large. Available letters check:')
      
      // DEBUG: Check what's available across all letters
      const availableLetters = getAvailableLetters()
      const debugInfo = {}
      availableLetters.forEach(letter => {
        const letterData = getVocabularyByLetter(letter)
        const availableNouns = (letterData.nouns || []).filter(noun => 
          !combinedExclude.includes(noun.german)
        )
        debugInfo[letter] = availableNouns.length
      })
      console.error('DEBUG: Available nouns by letter after exclude filtering:', debugInfo)
      return []
    }

    // Take the requested batch size from the shuffled all-nouns array
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

    this.currentBatch = selectedNouns.map(noun => ({
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
    this.addToExcludeList(selectedNouns.map(n => n.german))
    
    console.log('Generated plural batch with TRUE RANDOMIZATION:', {
      totalAvailable: allNouns.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 4: Articles in Context (30 sentences: 10 each case)
  generateArticlesBatch() {
    console.log('Generating articles batch with TRUE RANDOMIZATION')
    
    // CRITICAL FIX: Use ALL examples from ALL letters for true randomization
    const nominative = getAllExamplesFromAllLetters('nominative')
    const accusative = getAllExamplesFromAllLetters('accusative')
    const dative = getAllExamplesFromAllLetters('dative')
    
    if (!nominative || !accusative || !dative) {
      console.error('No examples available for articles batch')
      return []
    }

    this.currentBatch = [
      ...nominative.slice(0, 10).map(s => ({ ...s, type: 'article', caseType: 'nominative' })),
      ...accusative.slice(0, 10).map(s => ({ ...s, type: 'article', caseType: 'accusative' })),
      ...dative.slice(0, 10).map(s => ({ ...s, type: 'article', caseType: 'dative' }))
    ]

    this.currentBatchIndex = 0
    
    console.log('Generated articles batch with TRUE RANDOMIZATION:', {
      totalNominative: nominative.length,
      totalAccusative: accusative.length,
      totalDative: dative.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 5: Case Translations (30 sentences: 10 each case)
  generateTranslationBatch() {
    console.log('Generating translation batch with TRUE RANDOMIZATION')
    
    // CRITICAL FIX: Use ALL translations from ALL letters for true randomization
    const translations = getAllExamplesFromAllLetters('translations')
    
    if (!translations || translations.length === 0) {
      console.error('No translations available for translation batch')
      return []
    }

    this.currentBatch = translations.slice(0, 30).map(t => ({
      ...t,
      answer: t.german, // Ensure answer property exists
      type: 'translation'
    }))

    this.currentBatchIndex = 0
    
    console.log('Generated translation batch with TRUE RANDOMIZATION:', {
      totalAvailable: translations.length,
      batchSize: this.currentBatch.length
    })
    
    return this.currentBatch
  }

  // Generate Step 6: Verb Conjugation (3 rounds of 10 items)
  generateVerbBatch(exclude = [], batchSize = 10) {
    console.log('Generating verb batch with TRUE RANDOMIZATION:', { exclude: exclude.slice(0, 5), batchSize })
    
    // CRITICAL FIX: Use ALL verbs from ALL letters for true randomization
    const allVerbs = getAllVerbsFromAllLetters([...exclude, ...this.excludeList])
    
    if (!allVerbs || allVerbs.length === 0) {
      console.error('No verbs available for conjugation batch')
      return []
    }

    // Use explicit subjects to distinguish between singular "she" and plural "they"
    // Create mapping for clean subject vs display subject
    const subjectMapping = {
      'ich': { clean: 'ich', display: 'ich' },
      'du': { clean: 'du', display: 'du' },
      'er': { clean: 'er', display: 'er' },
      'sie (she)': { clean: 'sie', display: 'sie (she)' },
      'es': { clean: 'es', display: 'es' },
      'wir': { clean: 'wir', display: 'wir' },
      'ihr': { clean: 'ihr', display: 'ihr' },
      'sie (they)': { clean: 'sie', display: 'sie (they)' },
      'Sie': { clean: 'Sie', display: 'Sie' }
    }
    
    const displaySubjects = Object.values(subjectMapping)
    const cleanSubjects = Object.keys(subjectMapping)
    
    this.currentBatch = []
    for (let i = 0; i < batchSize; i++) {
      const verb = allVerbs[i % allVerbs.length]
      const cleanSubject = cleanSubjects[i % cleanSubjects.length]
      const subjectObj = subjectMapping[cleanSubject]
      const conjugation = verb.conjugations[cleanSubject]
      
      this.currentBatch.push({
        type: 'conjugation',
        question: `Conjugate "${verb.english}" for "${subjectObj.display}" (e.g., "ich bin"):`,
        answer: `${subjectObj.clean} ${conjugation}`, // Store clean subject in answer
        verb: verb.german,
        verbEnglish: verb.english,
        subject: subjectObj.display, // Keep display subject for reference
        cleanSubject: subjectObj.clean, // Store clean subject for validation
        conjugation: conjugation,
        word: verb.german // For progress tracking
      })
    }

    this.currentBatchIndex = 0
    this.addToExcludeList(allVerbs.slice(0, Math.ceil(batchSize / 2)).map(v => v.german))
    
    console.log('Generated verb batch with TRUE RANDOMIZATION:', {
      totalAvailable: allVerbs.length,
      batchSize: this.currentBatch.length
    })
    
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

  // DEBUG: Method to reset exclude list for testing
  resetExcludeList() {
    console.log('DEBUG: Resetting exclude list. Was:', this.excludeList.length, 'items')
    this.excludeList = []
    console.log('DEBUG: Exclude list reset to empty')
  }

  // DEBUG: Method to get exclude list size
  getExcludeListSize() {
    return this.excludeList.length
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
  validateAnswer(userAnswer, correctAnswer, type, exercise = null) {
    if (userAnswer === undefined || userAnswer === null || correctAnswer === undefined || correctAnswer === null) {
      console.warn('validateAnswer called with missing arguments', { userAnswer, correctAnswer, type })
      return false
    }

    // CRITICAL FIX: Normalize umlauts for ALL input to handle ue -> ü etc.
    const normalizedUser = this.normalizeUmlauts(String(userAnswer).trim())
    
    // Normalize correct answer(s) as well if needed (though database usually has ü)
    // But keeping it consistent in case DB has alternative spellings
    const normalizeCorrect = (val) => Array.isArray(val) 
      ? val.map(v => this.normalizeUmlauts(String(v).trim())) 
      : this.normalizeUmlauts(String(val).trim())

    const normalizedCorrect = normalizeCorrect(correctAnswer)

    console.log('Validating answer:', { userAnswer: normalizedUser, correctAnswer: normalizedCorrect, type })

    switch (type) {
      case 'noun':
      case 'verb':
      case 'plural':
        // Case-sensitive comparison for German words
        if (Array.isArray(normalizedCorrect)) {
          return normalizedCorrect.some(ans => this.caseSensitiveMatch(normalizedUser, ans))
        }
        
        // Check exact match first
        if (this.caseSensitiveMatch(normalizedUser, normalizedCorrect)) return true
        
        // Check synonyms for nouns
        if (type === 'noun' && exercise && exercise.english) {
           const synonyms = this.getSynonyms(exercise.english)
           // synonyms is array of noun objects. Check against their .german
           for (const syn of synonyms) {
             const normalizedSyn = this.normalizeUmlauts(syn.german)
             if (this.caseSensitiveMatch(normalizedUser, normalizedSyn)) return true
           }
        }
        return false
      
      case 'conjugation':
        // Special handling for conjugation - expect "subject + verb" format
        return this.validateConjugationAnswer(normalizedUser, normalizedCorrect, exercise)
      
      case 'article':
        // Case-sensitive for German articles but allow case variations
        const validArticles = ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'eines']
        return validArticles.includes(normalizedUser.toLowerCase()) && this.caseSensitiveMatch(normalizedUser, normalizedCorrect)
      
      case 'translation':
        // Case-sensitive for German translations with some flexibility
        if (Array.isArray(normalizedCorrect)) {
          return normalizedCorrect.some(ans => this.fuzzyMatch(normalizedUser, ans))
        }
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
  validateConjugationAnswer(userAnswer, correctAnswer, exercise = null) {
    // Apply umlaut normalization to user input
    const normalizedUser = this.normalizeUmlauts(userAnswer)
    // Handle array of correct answers if passed (unlikely for conjugation currently but good practice)
    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]
    
    for (const correct of correctAnswers) {
        const normalizedCorrect = this.normalizeUmlauts(correct)
        
        console.log('Conjugation validation details:', { 
          originalUser: userAnswer, 
          normalizedUser, 
          originalCorrect: correct, 
          normalizedCorrect 
        })

        // Parse user input to separate subject and verb
        const userParts = normalizedUser.split(' ')
        const correctParts = normalizedCorrect.split(' ')
        
        if (userParts.length === 2 && correctParts.length === 2) {
            const [userSubject, userVerb] = userParts
            const [correctSubject, correctVerb] = correctParts
            
            // For conjugation exercises, use clean subject comparison if available
            // Handle both new format (with cleanSubject) and old format (without)
            let cleanCorrectSubject = correctSubject
            if (exercise && exercise.cleanSubject) {
              cleanCorrectSubject = exercise.cleanSubject
            }
            
            // Check both subject and verb match (case-sensitive for verb, case-insensitive for subject)
            const subjectMatch = userSubject.toLowerCase() === cleanCorrectSubject.toLowerCase()
            const verbMatch = userVerb === correctVerb
            
            if (subjectMatch && verbMatch) return true
        }
    }
    
    return false
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
